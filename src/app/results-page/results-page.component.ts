import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-results-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results-page.component.html',
  styleUrls: ['./results-page.component.scss']
})
export class ResultsPageComponent implements OnInit {
  responses: { role: string; content: string }[] = [];

  ngOnInit(): void {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
      try {
        this.responses = JSON.parse(saved).filter((msg: any) => msg.role === 'user');
      } catch {
        this.responses = [];
      }
    }
  }
}
