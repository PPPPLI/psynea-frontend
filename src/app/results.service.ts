import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface FollowUp {
  date: string;
  anxiete: number;
  moral: number;
}

export interface Message {
  role: 'assistant' | 'user';
  content: string;
  date?: string;
}

export interface PatientResult {
  patientId: string;
  nom: string;
  age: number;
  etat: string;
  scoreAnxiete: number;
  scoreMoral: number;
  suicidaire: boolean;
  troubles: string[];
  objectif: string;
  autonomie: string;
  suivi: FollowUp[];
  historique: Message[];
  resumeIA?: string;
}


@Injectable({ providedIn: 'root' })
export class ResultsService {
  private http = inject(HttpClient);

  /** Charge tous les patients (JSON local pour l’instant) */
  getAll(): Observable<PatientResult[]> {
    return this.http
      .get<PatientResult[]>('/assets/patient-results.json')
      .pipe(map(res => res ?? []));
  }

  /** Trouve un patient par son id */
  getById(id: string): Observable<PatientResult | undefined> {
    return this.getAll().pipe(
      map(list => list.find(p => p.patientId === id))
    );
  }
}
