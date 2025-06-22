import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DashboardService } from './dashboard.service';
import { environment } from '../../../../environments/environment';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/movies`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DashboardService]
    });

    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call listYearsWithMostWinners', () => {
    const mockResponse = { years: [] };

    service.listYearsWithMostWinners().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}?projection=years-with-multiple-winners`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should call listStudiosWithMostWins', () => {
    const mockResponse = { studios: [] };

    service.listStudiosWithMostWins().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}?projection=studios-with-win-count`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should call getAwardIntervalsByProducer', () => {
    const mockResponse = { max: [], min: [] };

    service.getAwardIntervalsByProducer().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}?projection=max-min-win-interval-for-producers`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should call getWinnersByYear with year', () => {
    const mockResponse = [{ title: 'Filme', year: 2000 }];
    const year = '2000';

    service.getWinnersByYear(year).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}?winner=true&year=${year}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
  
});
