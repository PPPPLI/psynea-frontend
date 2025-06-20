import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatbot-page',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, FormsModule],
  templateUrl: './chatbot-page.component.html',
  styleUrl: './chatbot-page.component.scss'
})
export class ChatbotPageComponent {
  userInput = '';
  messages: any[] = [
    { role: 'assistant', content: 'Bonjour et bienvenue ! Commençons le questionnaire d’accueil. 😊' }
  ];
  loading = false;
  questionIndex = 0;
  conversationEnded = false;

  constructor(private http: HttpClient) {}

  sendMessage() {
    if (!this.userInput.trim() || this.loading || this.conversationEnded) return;

    const userMessage = { role: 'user', content: this.userInput };
    this.messages.push(userMessage);

    const payload = {
      history: [
        { role: 'system', content: 'Tu es un assistant thérapeutique Psynea. Pose les questions dans l’ordre avec bienveillance.' },
        ...this.messages
      ],
      question_index: this.questionIndex
    };

    this.userInput = '';
    this.loading = true;

    this.http.post<any>('http://localhost:8000/chat', payload).subscribe({
      next: (res) => {
        this.loading = false;

        if (res.emergency) {
          this.messages.push({ role: 'assistant', content: res.message });
          this.conversationEnded = true;
        } else {
          this.messages.push({ role: 'assistant', content: res.message });
          this.questionIndex = res.question_index ?? this.questionIndex;
          this.conversationEnded = res.end;
        }
      },
      error: () => {
        this.loading = false;
        this.messages.push({ role: 'assistant', content: 'Erreur de connexion au serveur.' });
      }
    });
  }
}
