import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { MoviesComponent } from './movies.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MoviesService } from './services/movies.service';
import { of, throwError } from 'rxjs';

describe('MoviesComponent', () => {
  let component: MoviesComponent;
  let fixture: ComponentFixture<MoviesComponent>;
  let mockMoviesService: jasmine.SpyObj<MoviesService>;

  beforeEach(async () => {
    mockMoviesService = jasmine.createSpyObj('MoviesService', ['listAll']);

    await TestBed.configureTestingModule({
      declarations: [MoviesComponent],
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        MatCardModule,
        MatPaginatorModule,
        MatTableModule,
      ],
      providers: [
        { provide: MoviesService, useValue: mockMoviesService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoviesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    mockMoviesService.listAll.and.returnValue(of({ content: [], totalElements: 0 }));
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should load movies and update dataSource', () => {
    const mockResponse = {
      content: [{ id: 1, year: 2020, title: 'Test Movie', winner: true }],
      totalElements: 1,
    };

    mockMoviesService.listAll.and.returnValue(of(mockResponse));
    fixture.detectChanges();

    expect(mockMoviesService.listAll).toHaveBeenCalledWith({ page: 0, size: 5 });
    expect(component.dataSource.data).toEqual(mockResponse.content);
  });

  it('should fetch all data if totalElements > 5', () => {
    const initialResponse = { content: [], totalElements: 10 };
    const fullResponse = { content: [{ id: 1, title: 'Full Movie', year: 2000, winner: false }], totalElements: 10 };

    mockMoviesService.listAll.withArgs({ page: 0, size: 5 }).and.returnValue(of(initialResponse));
    mockMoviesService.listAll.withArgs({ page: 0, size: 10 }).and.returnValue(of(fullResponse));

    component.loadInitialData();

    expect(mockMoviesService.listAll).toHaveBeenCalledTimes(2);
    expect(component.dataSource.data).toEqual(fullResponse.content);
  });

  it('should show error message if API fails', () => {
    const toastrSpy = spyOn(TestBed.inject(ToastrService), 'error');
    mockMoviesService.listAll.and.returnValue(throwError(() => new Error('API Error')));
    
    fixture.detectChanges();
    
    expect(toastrSpy).toHaveBeenCalledWith('Erro ao listar os filmes.');
  });

  it('should filter data based on filterPredicate', () => {
    const testData = [
        { id: 1, year: 2020, title: 'Movie A', winner: true },
        { id: 2, year: 2021, title: 'Movie B', winner: false },
    ];
    component.dataSource.data = testData;
    component.configureFilter();

    component.filters['year'] = '2020';
    component.dataSource.filter = JSON.stringify(component.filters);
    expect(component.dataSource.filteredData.length).toBe(1);
    expect(component.dataSource.filteredData[0].title).toBe('Movie A');

    component.filters['winner'] = 'false';
    component.dataSource.filter = JSON.stringify(component.filters);
    expect(component.dataSource.filteredData.length).toBe(0);
  });

  it('should initialize paginator with correct settings', () => {
    mockMoviesService.listAll.and.returnValue(of({ content: [], totalElements: 0 }));
    fixture.detectChanges();

    expect(component.paginator.pageSizeOptions).toEqual([5, 10, 20]);
    expect(component.paginator.showFirstLastButtons).toBeTrue();
  });
  
  it('should handle empty response gracefully', () => {
    mockMoviesService.listAll.and.returnValue(of({ content: [], totalElements: 0 }));
    fixture.detectChanges();

    expect(component.dataSource.data).toEqual([]);
    expect(component.totalElements).toBe(0);
  });

  it('should show error if second API call fails', () => {
    const toastrSpy = spyOn(TestBed.inject(ToastrService), 'error');
    mockMoviesService.listAll
        .withArgs({ page: 0, size: 5 }).and.returnValue(of({ content: [], totalElements: 10 }))
        .withArgs({ page: 0, size: 10 }).and.returnValue(throwError(() => new Error('API Error')));

    component.loadInitialData();
    expect(toastrSpy).toHaveBeenCalledWith('Erro ao listar os filmes.');
  });

});
