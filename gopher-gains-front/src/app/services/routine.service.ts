import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import type { ApiResponse } from '../models/api-response.model';
import type { Routine, CreateRoutineDto, UpdateRoutineDto } from '../models/routine.model';

@Injectable({ providedIn: 'root' })
export class RoutineService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/routine`;

  getAll(params?: { name?: string; frequency?: number; type?: string; order?: string; limit?: number; page?: number }) {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) httpParams = httpParams.set(k, String(v));
      });
    }
    return this.http.get<ApiResponse<Routine[]>>(`${this.baseUrl}/getAll`, { params: httpParams });
  }

  getById(id: number) {
    return this.http.get<ApiResponse<Routine>>(`${this.baseUrl}/getById/${id}`);
  }

  create(dto: CreateRoutineDto) {
    return this.http.post<ApiResponse<Routine>>(`${this.baseUrl}/create`, dto);
  }

  update(id: number, dto: UpdateRoutineDto) {
    return this.http.patch<ApiResponse<Routine>>(`${this.baseUrl}/update/${id}`, dto);
  }
}
