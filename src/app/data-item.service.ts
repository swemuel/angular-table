import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataItemService {
  tableData = [];
  constructor(private http: HttpClient) {}

  get() {
    return this.http.get<TableDataResponse>(`/api/person`).pipe(
      map((response) => {
        return response.items;
      })
    );
  }
}

interface TableDataResponse {
  items: TableData[];
  total_count: number;
}

export interface TableData {
  id: number;
  givenName: string;
  familyName: string;
  companyName: string;
}
