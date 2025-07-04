import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ERROR_MESSAGES } from '../../shared/constants/error.messages';
import { MovieRequest } from './models/movie-request.model';
import { MoviesService } from './services/movies.service';

@Component({
  selector: 'app-movies',
  standalone: false,
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss'
})
export class MoviesComponent {

  displayedColumns: string[] = ['id', 'year', 'title', 'winner'];
  dataSource = new MatTableDataSource<any>();
  pageEvent: PageEvent = new PageEvent;

  request: MovieRequest = {
    page: 0,
    size: 10,
  };

  filterValues: { year: number | null; winner: string } = {
    year: null,
    winner: ''
  };

  length = 0;
  pageSize = 10;
  pageIndex = 0;
  hidePageSize = true;

  constructor(
    private moviesService: MoviesService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.getMovies();
  }

  getMovies(){
    this.request.page = this.pageIndex;
    this.moviesService.getMovies(this.request)
      .subscribe({
        next: (res) => {
          this.dataSource.data = res.content;
          this.length = res.totalElements;
        },
        error: () => this.toastr.error(ERROR_MESSAGES.MOVIE.ERROR_LIST),
      });
  }

  handlePageEvent(e: PageEvent){
    this.pageIndex = e.pageIndex;
    this.getMovies();
  }

  filter(column: string) {
    const year = this.filterValues.year;
    const yearStr = year !== null && year !== undefined ? String(year) : '';

    if (yearStr && yearStr.length !== 4) {
      this.request.year = undefined;
      this.dataSource.data = [];
      return;
    }

    if (column === 'year') {
      this.request.year = year ?? undefined;
    }

    if (column === 'winner') {
      this.request.winner = this.filterValues.winner || undefined;
    }

    this.pageIndex = 0;
    this.getMovies();
  }

}