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

  listAll(request: any): Observable<any> {
    const params = `page=${request.page}&size=${request.size}`
    return this.http.get<any>(`${this.apiUrl}?${params}`);
  }

}
