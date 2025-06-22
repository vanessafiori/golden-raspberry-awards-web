import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { catchError, forkJoin, of } from 'rxjs';
import { DashboardService } from './services/dashboard.service';
import { ERROR_MESSAGES } from '../../shared/constants/error.messages';
import { ColumnModel } from '../../shared/components/table/models/column.model';

export interface Columns {
  name: string;
  title: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent {

  filterYear: number = 0;

  columnsYearsWithMostWinners: ColumnModel[] = [];
  columnsStudiosWithMostWins: ColumnModel[] = [];
  columnsAwardIntervals: ColumnModel[] = [];
  columnsWinnersByYear: ColumnModel[] = [];

  dataSourceYearsWithMostWinners = new MatTableDataSource<any>();
  dataSourceStudiosWithMostWins = new MatTableDataSource<any>();
  dataSourceMaxAwardIntervals = new MatTableDataSource<any>();
  dataSourceMinAwardIntervals = new MatTableDataSource<any>();
  dataSourceWinnersByYear = new MatTableDataSource<any>();

  constructor(
    private toastr: ToastrService,
    private dashboardService: DashboardService,
  ) { }

  ngOnInit() {
    this.initColumns();
    this.loadInitialData();
  }

  loadInitialData() {
    const years = this.dashboardService.listYearsWithMostWinners().pipe(
      catchError(error => {
        this.toastr.error(ERROR_MESSAGES.DASHBOARD.YEAR_WINNERS_ERROR);
        return of({ years: [] });
      })
    );

    const studios = this.dashboardService.listStudiosWithMostWins().pipe(
      catchError(error => {
        this.toastr.error(ERROR_MESSAGES.DASHBOARD.WINNERS_STUDIOS_ERROR);
        return of({ studios: [] });
      })
    );

    const intervals = this.dashboardService.getAwardIntervalsByProducer().pipe(
      catchError(error => {
        this.toastr.error(ERROR_MESSAGES.DASHBOARD.INTERVALS_AWARDS_ERROR);
        return of({ intervals: [] });
      })
    );

    forkJoin({
      yearsWithMostWinners: years,
      studiosWithMostWins: studios,
      awardIntervals: intervals
    }).subscribe({
      next: (result) => {
        if (result.yearsWithMostWinners) {
          this.dataSourceYearsWithMostWinners.data = result.yearsWithMostWinners.years;
        }
        
        if (result.studiosWithMostWins) {
          const topEstudios = result.studiosWithMostWins.studios.slice(0, 3);
          this.dataSourceStudiosWithMostWins.data = topEstudios;
        }
        
        if (result.awardIntervals) {
            this.dataSourceMaxAwardIntervals.data = result.awardIntervals.max;
            this.dataSourceMinAwardIntervals.data = result.awardIntervals.min;
        }
      },
      error: (error) => {
        this.toastr.error(ERROR_MESSAGES.DASHBOARD.LIST_ERROR);
      }
    });
  }

  getWinnersByYear(){
    if (this.filterYear >= 1981 && this.filterYear <= new Date().getFullYear()) {
      this.dashboardService.getWinnersByYear(this.filterYear.toString())
        .subscribe({
          next: (res) => {
            if(res.length > 0){
              this.dataSourceWinnersByYear.data = res;
            }else{
              this.toastr.error(ERROR_MESSAGES.DASHBOARD.BY_YEAR.WINNER_NOT_FOUND);
            }
          },
          error: () => {
            this.toastr.error(ERROR_MESSAGES.DASHBOARD.BY_YEAR.WINNER_LIST_ERROR);
          }
        });
      }else{
      this.toastr.error(ERROR_MESSAGES.DASHBOARD.BY_YEAR.INVALID_YEAR);
    }
  }

  initColumns(){
    this.columnsYearsWithMostWinners  = [
      { name: 'year', title: 'Year' },
      { name: 'winnerCount', title: 'Win Count' }
    ]
    this.columnsStudiosWithMostWins = [
      { name: 'name', title: 'Name' },
      { name: 'winCount', title: 'Win Count' }
    ]
    this.columnsAwardIntervals = [
      { name: 'producer', title: 'Producer' },
      { name: 'interval', title: 'Interval' },
      { name: 'previousWin', title: 'Previous Year' },
      { name: 'followingWin', title: 'Following Year' },
    ]
    this.columnsWinnersByYear = [
      { name: 'id', title: 'Id' },
      { name: 'year', title: 'Year' },
      { name: 'title', title: 'Title' },
    ]
  }

}
