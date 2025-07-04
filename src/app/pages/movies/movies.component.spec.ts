import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { MoviesComponent } from './movies.component';
import { MoviesService } from './services/movies.service';

describe('MoviesComponent', () => {
  let component: MoviesComponent;
  let fixture: ComponentFixture<MoviesComponent>;
  let mockMoviesService: jasmine.SpyObj<MoviesService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    mockMoviesService = jasmine.createSpyObj('MoviesService', ['getMovies']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['error']);

    await TestBed.configureTestingModule({
      declarations: [MoviesComponent],
      imports: [
        FormsModule,
        MatTableModule,
        MatPaginatorModule,
        MatCardModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MoviesService, useValue: mockMoviesService },
        { provide: ToastrService, useValue: toastrSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MoviesComponent);
    component = fixture.componentInstance;
  });

  it('should load movies on init', fakeAsync(() => {
    const mockResponse = {
      content: [{ id: 1, year: 2020, title: 'Test Movie', winner: true }],
      totalElements: 1
    };

    mockMoviesService.getMovies.and.returnValue(of(mockResponse));

    fixture.detectChanges();
    tick();

    expect(component.dataSource.data).toEqual(mockResponse.content);
    expect(component.length).toBe(1);
  }));

  it('should show error message if API fails', fakeAsync(() => {
    mockMoviesService.getMovies.and.returnValue(throwError(() => new Error('API error')));
    fixture.detectChanges();
    tick();

    expect(toastrSpy.error).toHaveBeenCalled();
  }));

  it('should apply winner filter and reload data', fakeAsync(() => {
    const mockResponse = {
      content: [{ id: 2, year: 2019, title: 'Filtered', winner: false }],
      totalElements: 1
    };

    mockMoviesService.getMovies.and.returnValue(of(mockResponse));
    component.filterValues.winner = 'false';
    component.filter('winner');
    tick();

    expect(component.request.winner).toBe('false');
    expect(component.dataSource.data).toEqual(mockResponse.content);
  }));

  it('should ignore year filter if invalid length', () => {
    component.filterValues.year = 123;
    component.filter('year');

    expect(component.dataSource.data).toEqual([]);
    expect(component.request.year).toBeUndefined();
  });

  it('should apply year filter and reload data if valid', fakeAsync(() => {
    const mockResponse = {
      content: [{ id: 3, year: 2020, title: 'Another', winner: false }],
      totalElements: 1
    };

    mockMoviesService.getMovies.and.returnValue(of(mockResponse));
    component.filterValues.year = 2020;
    component.filter('year');
    tick();

    expect(component.request.year).toBe(2020);
    expect(component.dataSource.data).toEqual(mockResponse.content);
  }));

  it('should handle pagination', fakeAsync(() => {
    const mockResponse = {
      content: [{ id: 4, year: 2021, title: 'Paginated', winner: true }],
      totalElements: 2
    };

    mockMoviesService.getMovies.and.returnValue(of(mockResponse));
    component.handlePageEvent({ pageIndex: 1, pageSize: 10, length: 2 } as any);
    tick();

    expect(component.pageIndex).toBe(1);
    expect(component.dataSource.data).toEqual(mockResponse.content);
  }));
});