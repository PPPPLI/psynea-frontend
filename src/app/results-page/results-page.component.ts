import {
  Component,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
  ElementRef,
  ViewChild
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
export class ResultsPageComponent
  implements OnInit, AfterViewInit, AfterViewChecked {

  /* -------------------- données globales -------------------- */
  responses: { role: string; content: string }[] = [];
  userResponses: string[] = [];               // <-- pour le graphique “participation”
  patients: PatientResult[] = [];
  showChart = false;

  /* -------------------- navigation patient ------------------ */
  currentPatientIndex = 0;
  private needChartRefresh = false;           // déclencheur de refresh graphique

  get currentPatient(): PatientResult | undefined {
    return this.patients[this.currentPatientIndex];
  }

  nextPatient(): void {
    if (this.currentPatientIndex < this.patients.length - 1) {
      this.currentPatientIndex++;
      this.needChartRefresh = true;
      this.showChart = false;
    }
  }

  prevPatient(): void {
    if (this.currentPatientIndex > 0) {
      this.currentPatientIndex--;
      this.needChartRefresh = true;
      this.showChart = false;
    }
  }

  toggleChart(): void {
    this.showChart = !this.showChart;
    if (this.showChart) {
      this.needChartRefresh = true;
    }
  }


  /* -------------------- Chart.js ---------------------------- */
  private patientChart?: Chart;
  @ViewChild('participationChart') participationChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('patientEmotionChart') patientEmotionChartRef!: ElementRef<HTMLCanvasElement>;

  constructor(private resultsSrv: ResultsService) {}

  /* -------------------- cycle de vie ------------------------ */
  ngOnInit(): void {
    /* 1. charge l’historique global du chatbot (facultatif) */
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
      try {
        this.responses = JSON.parse(saved);
        this.userResponses = this.responses
          .filter(m => m.role === 'user')
          .map(m => m.content);
      } catch (e) {
        console.error('JSON invalide', e);
      }
    }

    /* 2. charge les patients (JSON local ou futur endpoint API) */
    this.resultsSrv.getAll().subscribe(data => {
      this.patients = data;
      /* déclenche le rendu du 1er patient dès que les données arrivent */
      this.needChartRefresh = true;
    });
  }

  ngAfterViewInit(): void {
    /* graphique global (participation) */
    if (this.userResponses.length) {
      this.renderParticipationChart();
    }
    /* si les patients étaient déjà chargés avant l’init de la vue */
    if (this.patients.length) {
      this.renderPatientEmotionChart();
    }
  }

  ngAfterViewChecked(): void {
    if (this.needChartRefresh) {
      this.needChartRefresh = false;
      this.renderPatientEmotionChart();
    }
  }

  /* -------------------- graphiques -------------------------- */
  private renderPatientEmotionChart(): void {
    if (!this.currentPatient || !this.patientEmotionChartRef) return;

    /* extrait seules les réponses utilisateur */
    const userInputs = (this.currentPatient.historique || [])
      .filter(m => m.role === 'user')
      .map(m => m.content.toLowerCase());

    if (userInputs.length === 0) return;

    /* keywords très simples (à affiner) */
    const anxieteKeywords = ['peur', 'angoisse', 'stress', 'panique'];
    const moralKeywords   = ['heureux', 'bien', 'mal', 'triste', 'vide'];

    const emotionScores = userInputs.map(txt => ({
      anxiete: anxieteKeywords.some(k => txt.includes(k))
        ? 7 + Math.random() * 2
        : 2 + Math.random() * 2,
      moral: moralKeywords.some(k => txt.includes(k))
        ? 6 + Math.random() * 2
        : 3 + Math.random() * 2
    }));

    /* détruit l’ancien chart pour éviter les fuites mémoire */
    if (this.patientChart) this.patientChart.destroy();

    const ctx = this.patientEmotionChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.patientChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: userInputs.map((_, i) => `Q${i + 1}`),
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
        plugins: { title: { display: true, text: 'Évolution anxiété / moral (estimée)' } },
        scales: { y: { min: 0, max: 10 } }
      }
    });
  }

  /** graphique de “participation” global (facultatif) */
  private renderParticipationChart(): void {
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
        plugins: { title: { display: true, text: 'Participation aux questions' }, legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    });
  }
}
