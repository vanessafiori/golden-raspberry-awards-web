import { Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ColumnModel } from './models/column.model';

@Component({
  selector: 'app-table',
  standalone: false,
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {

  @Input() displayedColumns: ColumnModel[] = [];
  @Input() dataSource = new MatTableDataSource<any>();

  ngOnInit(): void {
  }

  get columnNames(): string[] {
    return this.displayedColumns.map(col => col.name);
  }

}
