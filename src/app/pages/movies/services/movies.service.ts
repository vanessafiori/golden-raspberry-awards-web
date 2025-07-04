import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  private readonly apiUrl = `${environment.apiUrl}/movies`;

  constructor(
      private http: HttpClient
  ) {}

  getMovies(request: any): Observable<any> {
    let params = `page=${request.page}&size=${request.size}`;
    if(request.winner){
      params += `&winner=${request.winner}`
    }
    if(request.year){
      params += `&year=${request.year}`
    }
    return this.http.get<any>(`${this.apiUrl}?${params}`);
  }

}
