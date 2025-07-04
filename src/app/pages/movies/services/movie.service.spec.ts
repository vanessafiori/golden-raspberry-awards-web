import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { MoviesService } from './movies.service';
import { environment } from '../../../../environments/environment';

describe('MoviesService', () => {
  let service: MoviesService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/movies`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MoviesService],
    });

    service = TestBed.inject(MoviesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getMovies should make GET request with correct params', () => {
    const mockRequest = { page: 2, size: 10 };
    const mockResponse = { data: ['movie1', 'movie2'] };

    service.getMovies(mockRequest).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}?page=2&size=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
