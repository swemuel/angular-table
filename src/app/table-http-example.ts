import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataItemService, TableData } from './data-item.service';
import { FormControl } from '@angular/forms';

/**
 * @title Table retrieving data through HTTP
 */
@Component({
  selector: 'table-http-example',
  styleUrls: ['table-http-example.css'],
  templateUrl: 'table-http-example.html',
})
export class TableHttpExample implements OnInit {
  displayedColumns: string[] = ['givenName', 'familyName', 'companyName'];
  //exampleDatabase: ExampleHttpDatabase | null;
  //data: GithubIssue[] = [];
  //dataSource: MatTableDataSource<GithubIssue>;
  dataSource: any;

  givenNameFilter = new FormControl();
  familyNameFilter = new FormControl();
  companyNameFilter = new FormControl();
  globalFilter = '';

  filteredValues = {
    givenName: '',
    familyName: '',
    companyName: '',
  };

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dataItemService: DataItemService) {}

  ngOnInit() {
    this.setData();
    this.givenNameFilter.valueChanges.subscribe((givenNameFilterValue) => {
      this.filteredValues['givenName'] = givenNameFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    this.familyNameFilter.valueChanges.subscribe((familyNameFilterValue) => {
      this.filteredValues['familyName'] = familyNameFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    this.companyNameFilter.valueChanges.subscribe((companyNameFilterValue) => {
      this.filteredValues['companyName'] = companyNameFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
  }
  //this.dataSource.paginator = this.paginator;
  //.dataSource.sort = this.sort;

  setData() {
    this.dataItemService.get().subscribe(
      (res) => {
        this.dataSource = new MatTableDataSource(res);
      },
      (errorResponse) => {
        console.log(errorResponse);
      },
      () => {
        this.dataSource.filterPredicate = this.customFilterPredicate();
      }
    );
    console.log(this.dataSource);
  }

  applyFilter(filter: any) {
    console.log('applyFiler() called');
    this.globalFilter = filter;
    this.dataSource.filter = JSON.stringify(this.filteredValues);
  }

  customFilterPredicate() {
    const myFilterPredicate = (data: TableData, filter: string): boolean => {
      var globalMatch = !this.globalFilter;

      if (this.globalFilter) {
        // search all text fields
        globalMatch =
          data.id.toString()
            .trim()
            .toLowerCase()
            .indexOf(this.globalFilter.toLowerCase()) !== -1;
      }

      if (!globalMatch) {
        console.log('false');
        return false;
      }

      console.log(filter);
      let searchString = JSON.parse(filter);
      console.log(searchString);
      return (
        data.givenName.trim().indexOf(searchString.givenName) !== -1 &&
        data.familyName
          .trim()
          .toLowerCase()
          .indexOf(searchString.familyName.toLowerCase()) !== -1 &&
        data.companyName
          .trim()
          .toLowerCase()
          .indexOf(searchString.companyName.toLowerCase()) !== -1
      );
    };
    return myFilterPredicate;
  }
}

/**  Copyright 2022 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at https://angular.io/license */
