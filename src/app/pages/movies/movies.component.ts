import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ERROR_MESSAGES } from '../../shared/constants/error.messages';
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
  totalElements: number = 0;

  @ViewChild(MatPaginator)
  paginator: MatPaginator = new MatPaginator;

  filters: { [column: string]: string } = {};

  constructor(
    private moviesService: MoviesService,
    private toastr: ToastrService,
  ) { }

  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = '';
    this.dataSource.paginator = this.paginator;
    this.configureFilter();
    this.loadInitialData();
  }

  loadInitialData() {
    const request = { page: 0, size: 5 };

    this.moviesService.listAll(request)
      .subscribe({
        next: (res) => {
          this.dataSource.data = res.content;
          this.totalElements = res.totalElements;

          if (this.totalElements > 5) {
            const newRequest = { page: 0, size: this.totalElements };

            this.moviesService.listAll(newRequest).subscribe({
              next: (completeResponse) => {
                this.dataSource.data = completeResponse.content;
              },
              error: () => this.toastr.error(ERROR_MESSAGES.MOVIE.ERROR_LIST),
            });
          }
        },
        error: () => this.toastr.error(ERROR_MESSAGES.MOVIE.ERROR_LIST),
      });
  }

  configureFilter() {
    this.dataSource.filterPredicate = (data, filterJson: string) => {
      const filter = JSON.parse(filterJson);
      return Object.entries(filter).every(([column, filterValue]) => 
        (data[column]?.toString().toLowerCase() || '').includes(filterValue as string)
      );
    };
  }

  filter(event: Event, column: string) {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filters[column] = value;
    this.dataSource.filter = JSON.stringify(this.filters);
  }

}