import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface FollowUp {
  date: string;
  anxiete: number;
  moral: number;
}
export interface PatientResult {
  patientId: string;
  nom: string;
  age: number;
  etat: string;
  suivi: FollowUp[];
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
