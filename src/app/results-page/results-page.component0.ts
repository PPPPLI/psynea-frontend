import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  AfterViewChecked
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultsService, PatientResult } from '../results.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-results-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results-page.component.html',
  styleUrls: ['./results-page.component.scss']
})
export class ResultsPageComponent implements OnInit, AfterViewInit, AfterViewChecked {
  responses: { role: string; content: string }[] = [];
  userResponses: string[] = [];
  patients: PatientResult[] = [];
  currentPatientIndex = 0;
  private patientChart?: Chart;
  private needChartRefresh = false;

  get currentPatient(): PatientResult | undefined {
    return this.patients[this.currentPatientIndex];
  }

  nextPatient(): void {
    if (this.currentPatientIndex < this.patients.length - 1) {
      this.currentPatientIndex++;
      this.needChartRefresh = true;
    }
  }

  prevPatient(): void {
    if (this.currentPatientIndex > 0) {
      this.currentPatientIndex--;
      this.needChartRefresh = true;
    }
  }

  constructor(private resultsSrv: ResultsService) {};

  // ⬇️  static:false (valeur par défaut) pour avoir la ref APRES le rendu
  @ViewChild('participationChart') participationChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('emotionChart')       emotionChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('patientEmotionChart') patientEmotionChartRef!: ElementRef<HTMLCanvasElement>;


  ngOnInit(): void {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
      try {
        this.responses = JSON.parse(saved);
        this.userResponses = this.responses
          .filter(m => m.role === 'user')
          .map(m => m.content);
        console.log('Réponses chargées :', this.userResponses);
      } catch (e) {
        console.error('JSON invalide', e);
      }
    }
    this.resultsSrv.getAll().subscribe(data => {
      this.patients = data;
      console.log('Patients chargés :', this.patients);
    });
  }

  /** Les ViewChild sont prêts seulement ici */
  ngAfterViewInit(): void {
    // chart des réponses utilisateur (si tu le gardes)
    if (this.userResponses.length) {
      this.renderParticipationChart();
    }
    // chart du patient courant
    this.renderPatientEmotionChart();
  }

  ngAfterViewChecked(): void {
    if (this.needChartRefresh) {
      this.needChartRefresh = false;
      this.renderPatientEmotionChart();
    }
  }

  /** NEW : graphique anxiété/moral pour le patient courant */
  /**
  private renderPatientEmotionChart(): void {
    if (!this.currentPatient || !this.patientEmotionChartRef) return;

    console.log('Rendu du graphique pour', this.currentPatient?.nom);
    console.log('ViewChild dispo ?', this.patientEmotionChartRef);
    const ctx = this.patientEmotionChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Détruit l’ancien graphique avant d’en créer un nouveau
    if (this.patientChart) {
      this.patientChart.destroy();
    }

    this.patientChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.currentPatient.suivi.map(s => s.date),
        datasets: [
          {
            label: 'Anxiété',
            data: this.currentPatient.suivi.map(s => s.anxiete),
            borderColor: '#ef5350',
            tension: 0.3
          },
          {
            label: 'Moral',
            data: this.currentPatient.suivi.map(s => s.moral),
            borderColor: '#66bb6a',
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Évolution anxiété / moral' }
        },
        scales: {
          y: { min: 0, max: 10 }
        }
      }
    });
  }
    **/
  private renderPatientEmotionChart(): void {
    if (!this.currentPatient || !this.patientEmotionChartRef) return;

    // Récupère uniquement les inputs utilisateur
    const userInputs = (this.currentPatient.historique || [])
      .filter(m => m.role === 'user')
      .map(m => m.content.toLowerCase());

    if (userInputs.length === 0) return; // Rien à tracer

    // ------------------ Définition des scores à partir de mots-clés ------------------
    const anxieteKeywords = ['peur', 'angoisse', 'stress', 'panique'];
    const moralKeywords   = ['heureux', 'bien', 'mal', 'triste', 'vide'];

    const emotionScores = userInputs.map(input => ({
      anxiete: anxieteKeywords.some(k => input.includes(k))
        ? 7 + Math.random() * 2
        : 2 + Math.random() * 2,
      moral:   moralKeywords.some(k => input.includes(k))
        ? 6 + Math.random() * 2
        : 3 + Math.random() * 2
    }));
    // -------------------------------------------------------------------------------

    // Détruit l’ancien graphique
    if (this.patientChart) this.patientChart.destroy();

    const ctx = this.patientEmotionChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.patientChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: userInputs.map((_, i) => `Q${i + 1}`),   // ✅ libellés Q1, Q2, …
        datasets: [
          {
            label: 'Anxiété (est.)',
            data: emotionScores.map(s => s.anxiete),
            borderColor: '#ef5350',
            tension: 0.3
          },
          {
            label: 'Moral (est.)',
            data: emotionScores.map(s => s.moral),
            borderColor: '#66bb6a',
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Évolution anxiété / moral (estimée)' }
        },
        scales: { y: { min: 0, max: 10 } }
      }
    });
  }


  /** Exemple : nombre de réponses utilisateur */
  renderParticipationChart(): void {
    const ctx = this.participationChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.userResponses.map((_, i) => `Q${i + 1}`),
        datasets: [{
          label: 'Réponses utilisateur',
          data: this.userResponses.map(() => 1),
          backgroundColor: '#42a5f5'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Participation aux questions' },
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } }
        }
      }
    });
  }


  /** Démo d’analyse naïve : détecte anxiété/moral avec mots-clés */
  renderEmotionChart(): void {
    const ctx = this.emotionChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Évaluation très simple à partir de mots-clés (à améliorer plus tard)
    const anxieteKeywords = ['peur', 'angoisse', 'stress', 'panique'];
    const moralKeywords = ['heureux', 'bien', 'mal', 'triste', 'vide'];

    const emotionScores = this.userResponses.map(resp => {
      const l = resp.toLowerCase();
      return {
        anxiete: anxieteKeywords.some(w => l.includes(w)) ? 7 + Math.random() * 3 : 2 + Math.random() * 2,
        moral: moralKeywords.some(w => l.includes(w)) ? 6 + Math.random() * 2 : 3 + Math.random() * 2
      };
    });

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.userResponses.map((_, i) => `Q${i + 1}`),
        datasets: [
          {
            label: 'Estimation Anxiété',
            data: emotionScores.map(s => s.anxiete),
            borderColor: '#ef5350',
            tension: 0.3
          },
          {
            label: 'Estimation Moral',
            data: emotionScores.map(s => s.moral),
            borderColor: '#66bb6a',
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Estimation émotionnelle des réponses' }
        },
        scales: {
          y: { min: 0, max: 10 }
        }
      }
    });
  }
}
