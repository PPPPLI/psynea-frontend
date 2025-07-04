import {
  Component,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
  ElementRef,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResultsService, PatientResult, Message } from '../results.service';
import Chart from 'chart.js/auto';

type MessageWithDate = {
  content: string;
  date: string;
};


@Component({
  selector: 'app-results-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './results-page.component.html',
  styleUrls: ['./results-page.component.scss']
})
export class ResultsPageComponent
  implements OnInit, AfterViewInit, AfterViewChecked {

  /* -------------------- données globales -------------------- */
  responses: { role: string; content: string }[] = [];
  userResponses: string[] = [];
  patients: PatientResult[] = [];
  showChart = false;

  /* -------------------- navigation patient ------------------ */
  currentPatientIndex = 0;
  private needChartRefresh = false;

  /* -------- propriétés pour filtre/tri -------- */
  filteredPatients: PatientResult[] = [];
  troubleList: string[] = [];
  selectedTrouble = 'Tous';
  sortDesc = true;
  searchTerm: string = '';
  private troubleChart?: Chart;

  /* -------------------- Moyennes et compte ------------------*/
  avgAnxiete: number = 0;
  avgMoral: number = 0;
  suicideCount: number = 0;

  get currentPatient(): PatientResult | undefined {
    //return this.patients[this.currentPatientIndex];
    return this.filteredPatients[this.currentPatientIndex];
  }

  nextPatient(): void {
    if (this.currentPatientIndex < this.filteredPatients.length - 1) {
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
    //this.filteredPatients = [...this.patients];
    this.filterPatients();
    this.avgAnxiete = this.patients.reduce((sum, p) => sum + p.scoreAnxiete, 0) / this.patients.length;
    this.avgMoral = this.patients.reduce((sum, p) => sum + p.scoreMoral, 0) / this.patients.length;
    this.suicideCount = this.patients.filter(p => p.suicidaire).length;


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

    this.resultsSrv.getAll().subscribe(data => {
      this.patients = data;
      console.log('Patients chargés :', this.patients);

      const set = new Set<string>();
      this.patients.forEach(p => (p.troubles || []).forEach(t => set.add(t)));
      this.troubleList = Array.from(set);
      this.filteredPatients = [...this.patients];

      if (this.patients.length > 0) {
        this.avgAnxiete = this.patients.reduce((sum, p) => sum + p.scoreAnxiete, 0) / this.patients.length;
        this.avgMoral = this.patients.reduce((sum, p) => sum + p.scoreMoral, 0) / this.patients.length;
        this.suicideCount = this.patients.filter(p => p.suicidaire).length;
      }

      this.renderParticipationChart();
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

  updateTroubleChart(): void {
    this.filterPatients();
    this.renderParticipationChart();

    if (this.selectedTrouble === 'Tous') {
      this.filteredPatients = [...this.patients];
    } else {
      this.filteredPatients = this.patients.filter(p =>
        p.troubles && p.troubles.includes(this.selectedTrouble)
      );
    }

    this.currentPatientIndex = 0;
    this.renderParticipationChart();
  }


  toggleSort(): void {
    this.sortDesc = !this.sortDesc;
    this.renderParticipationChart();
  }

  /** Filtre combiné : nom/prénom + trouble */
  filterPatients(): void {
    const term = this.searchTerm.trim().toLowerCase();

    let list = [...this.patients];

    if (this.selectedTrouble !== 'Tous') {
      list = list.filter(p => p.troubles?.includes(this.selectedTrouble));
    }

    if (term) {
      list = list.filter(p =>
        p.nom.toLowerCase().includes(term)
      );
    }

    this.filteredPatients = list;
    this.currentPatientIndex = 0;
  }



  private renderPatientEmotionChart(): void {
    if (!this.currentPatient || !this.patientEmotionChartRef) return;

    type MessageWithDate = { content: string; date: string };
    const isUserMessageWithDate = (m: any): m is MessageWithDate =>
      m.role === 'user' && typeof m.content === 'string' && typeof m.date === 'string';

    const rawUserMessages = (this.currentPatient.historique || [])
      .filter(m => m.role === 'user' && typeof (m as any).date === 'string')
      .map(m => ({
        content: m.content.toLowerCase(),
        date: (m as any).date as string
      }));

    if (rawUserMessages.length === 0) return;

    const sorted = rawUserMessages
      .filter(m => !!m.date)
      .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());

    const anxieteKeywords = ['peur', 'angoisse', 'stress', 'panique'];
    const moralKeywords   = ['heureux', 'bien', 'mal', 'triste', 'vide'];

    const emotionScores = sorted.map(({ content }) => ({
      anxiete: anxieteKeywords.some(k => content.includes(k)) ? 7 + Math.random() * 2 : 2 + Math.random() * 2,
      moral:   moralKeywords.some(k => content.includes(k))   ? 6 + Math.random() * 2 : 3 + Math.random() * 2
    }));

    const ctx = this.patientEmotionChartRef.nativeElement.getContext('2d');
    if (!ctx) return;
    if (this.patientChart) this.patientChart.destroy();

    this.patientChart = new Chart(ctx, {
      type: 'line',
      data: {
        //labels: sorted.map(m => new Date(m.date).toLocaleDateString('fr-FR')),
        labels: sorted.map(m => new Date(m.date!).toLocaleDateString('fr-FR')),
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
          title: { display: true, text: 'Évolution anxiété / moral (par date)' }
        },
        scales: {
          y: { min: 0, max: 10 }
        }
      }
    });
  }

  renderParticipationChart(): void {
    const ctx = this.participationChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const { labels, data } = this.buildTroubleChartData();
    if (labels.length === 0) return;

    /* détruit ancien chart */
    if (this.troubleChart) this.troubleChart.destroy();

    this.troubleChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Patients',
          data,
          backgroundColor: this.getColors(labels.length)
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Patients par trouble' },
          legend: { display: false }
        },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    });
  }


  private buildTroubleChartData() {
    const counts: Record<string, number> = {};

    if (this.selectedTrouble === 'Tous') {
      // Cas général : tous les troubles
      this.patients.forEach(p => {
        (p.troubles || []).forEach(t => {
          counts[t] = (counts[t] || 0) + 1;
        });
      });
    } else {
      // Cas filtré : un seul trouble
      this.patients.forEach(p => {
        if (p.troubles.includes(this.selectedTrouble)) {
          counts[this.selectedTrouble] = (counts[this.selectedTrouble] || 0) + 1;
        }
      });
    }

    let entries = Object.entries(counts);
    entries = entries.sort((a, b) =>
      this.sortDesc ? b[1] - a[1] : a[1] - b[1]);

    return {
      labels: entries.map(e => e[0]),
      data:   entries.map(e => e[1])
    };
  }

  private getColors(n: number): string[] {
    const base = ['#42a5f5', '#66bb6a', '#ef5350', '#ffa726',
      '#ab47bc', '#26c6da', '#d4e157', '#8d6e63'];
    const colors: string[] = [];
    for (let i = 0; i < n; i++) {
      colors.push(base[i % base.length]);
    }
    return colors;
  }

}
