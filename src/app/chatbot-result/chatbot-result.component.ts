import { Component, AfterViewInit } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-chatbot-result',
  templateUrl: './chatbot-result.component.html',
  styleUrls: ['./chatbot-result.component.scss']
})
export class ChatbotResultComponent implements AfterViewInit {

  weeklyQuestion = 'Comment te sens-tu cette semaine ? (1-10)';
  weeklyScore: number | null = null;

  result = {
    anxiete: 6,
    moral: 7,
    suicidal: false,
    troubles: ['sommeil', 'stress'],
    objectif: 'Arrêter de fumer',
    autonomie: 'Souhaite du soutien'
  };

  ngAfterViewInit(): void {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawChart);
  }

  drawChart = () => {
    const data = google.visualization.arrayToDataTable([
      ['Semaine', 'Score Anxiété'],
      ['Semaine 1', 8],
      ['Semaine 2', 6],
      ['Semaine 3', 7],
      ['Semaine 4', 5],
      ['Semaine 5', 6],
    ]);

    const options = {
      title: 'Évolution de l’anxiété',
      curveType: 'function',
      legend: { position: 'bottom' },
      colors: ['#2563eb']
    };

    const chart = new google.visualization.LineChart(document.getElementById('anxiete-chart'));
    chart.draw(data, options);
  };

  submitWeekly() {
    if (this.weeklyQuestion && this.weeklyScore !== null) {
      console.log('Question:', this.weeklyQuestion);
      console.log('Score hebdomadaire soumis :', this.weeklyScore);
    } else {
      console.warn('Veuillez remplir la question et la réponse.');
    }
  }
}
