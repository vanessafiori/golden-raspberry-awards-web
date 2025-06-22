import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly apiUrl = `${environment.apiUrl}/movies`;

  constructor(
      private http: HttpClient
  ) {}

  listYearsWithMostWinners(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?projection=years-with-multiple-winners`);
  }

  listStudiosWithMostWins(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?projection=studios-with-win-count`);
  }

  getAwardIntervalsByProducer(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?projection=max-min-win-interval-for-producers`);
  }

  getWinnersByYear(year: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?winner=true&year=${year}`);
  }

}
