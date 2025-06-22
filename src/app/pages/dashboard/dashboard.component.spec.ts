import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { TableComponent } from '../../shared/components/table/table.component';
import { DashboardComponent } from './dashboard.component';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { DashboardService } from './services/dashboard.service';
import { of, throwError } from 'rxjs';
import { ERROR_MESSAGES } from '../../shared/constants/error.messages';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockDashboardService: jasmine.SpyObj<DashboardService>;

  beforeEach(async () => {
    mockDashboardService = jasmine.createSpyObj(
        'DashboardService', 
        [
          'listYearsWithMostWinners',
          'listStudiosWithMostWins',
          'getAwardIntervalsByProducer',
          'getWinnersByYear',
        ]);

    mockDashboardService.listYearsWithMostWinners.and.returnValue(of({ years: [] }));
    mockDashboardService.listStudiosWithMostWins.and.returnValue(of({ studios: [] }));
    mockDashboardService.getAwardIntervalsByProducer.and.returnValue(of({ max: [], min: [] }));

    await TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        TableComponent
      ],
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        FormsModule,
        MatCardModule,
        MatIconModule,
        MatTableModule
      ],
      providers: [
        { provide: DashboardService, useValue: mockDashboardService },
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create and initialize columns', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.columnsYearsWithMostWinners.length).toBeGreaterThan(0);
    expect(component.columnsStudiosWithMostWins.length).toBeGreaterThan(0);
    expect(component.columnsAwardIntervals.length).toBeGreaterThan(0);
    expect(component.columnsWinnersByYear.length).toBeGreaterThan(0);
  });

  it('should load initial data correctly', () => {
    const mockData = {
        yearsWithMostWinners: { years: [{year: 2018, winnerCount: 2}] },
        studiosWithMostWins: { studios: [{name: 'Studio1', winCount: 5}] },
        awardIntervals: { 
          max: [{producer: 'Prod1', interval: 10}],
          min: [{producer: 'Prod2', interval: 1}]
        }
    };

    mockDashboardService.listYearsWithMostWinners.and.returnValue(of(mockData.yearsWithMostWinners));
    mockDashboardService.listStudiosWithMostWins.and.returnValue(of(mockData.studiosWithMostWins));
    mockDashboardService.getAwardIntervalsByProducer.and.returnValue(of(mockData.awardIntervals));

    fixture.detectChanges();

    expect(component.dataSourceYearsWithMostWinners.data).toEqual(mockData.yearsWithMostWinners.years);
    expect(component.dataSourceStudiosWithMostWins.data.length).toBe(1);
    expect(component.dataSourceMaxAwardIntervals.data).toEqual(mockData.awardIntervals.max);
    expect(component.dataSourceMinAwardIntervals.data).toEqual(mockData.awardIntervals.min);
  });

  it('should handle errors when loading initial data', () => {
    const toastrSpy = spyOn(TestBed.inject(ToastrService), 'error');
    
    mockDashboardService.listYearsWithMostWinners.and.returnValue(throwError(() => new Error()));
    mockDashboardService.listStudiosWithMostWins.and.returnValue(throwError(() => new Error()));
    mockDashboardService.getAwardIntervalsByProducer.and.returnValue(throwError(() => new Error()));

    component.loadInitialData();

    expect(toastrSpy).toHaveBeenCalledWith(ERROR_MESSAGES.DASHBOARD.YEAR_WINNERS_ERROR);
    expect(toastrSpy).toHaveBeenCalledWith(ERROR_MESSAGES.DASHBOARD.WINNERS_STUDIOS_ERROR);
    expect(toastrSpy).toHaveBeenCalledWith(ERROR_MESSAGES.DASHBOARD.INTERVALS_AWARDS_ERROR);
  });

  it('should validate year range', () => {
    const toastrSpy = spyOn(TestBed.inject(ToastrService), 'error');
    
    component.filterYear = 1980;
    component.getWinnersByYear();
    expect(toastrSpy).toHaveBeenCalledWith(ERROR_MESSAGES.DASHBOARD.BY_YEAR.INVALID_YEAR);
    
    component.filterYear = new Date().getFullYear() + 1;
    component.getWinnersByYear();
    expect(toastrSpy).toHaveBeenCalledTimes(2);
  });

  it('should populate winners by year', () => {
    const mockResult = [{ id: 1, year: 2020, title: 'Filme 1' }];
    component.filterYear = 2020;
    mockDashboardService.getWinnersByYear.and.returnValue(of(mockResult));

    component.getWinnersByYear();

    expect(component.dataSourceWinnersByYear.data).toEqual(mockResult);
  });

  it('should handle no winners found', () => {
    const toastrSpy = spyOn(TestBed.inject(ToastrService), 'error');
    component.filterYear = 2018;
    
    mockDashboardService.getWinnersByYear.and.returnValue(of([]));
    component.getWinnersByYear();

    expect(toastrSpy).toHaveBeenCalledWith(ERROR_MESSAGES.DASHBOARD.BY_YEAR.WINNER_NOT_FOUND);
  });

  it('should limit to top 3 studios', () => {
    const mockData = {
        studios: [
        {name: 'Studio1', winCount: 5},
        {name: 'Studio2', winCount: 4},
        {name: 'Studio3', winCount: 3},
        {name: 'Studio4', winCount: 2}
        ]
    };

    mockDashboardService.listStudiosWithMostWins.and.returnValue(of(mockData));
    component.loadInitialData();

    expect(component.dataSourceStudiosWithMostWins.data.length).toBe(3);
  });

});
