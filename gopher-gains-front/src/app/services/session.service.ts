import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import type { ApiResponse } from '../models/api-response.model';
import type { WorkoutSession, CreateWorkoutSessionDto, UpdateWorkoutSessionDto } from '../models/session.model';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/sessions`;

  getAll(params?: { userId?: number; status?: string; order?: string; limit?: number; page?: number }) {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) httpParams = httpParams.set(k, String(v));
      });
    }
    return this.http.get<ApiResponse<WorkoutSession[]>>(`${this.baseUrl}/getAll`, { params: httpParams });
  }

  getById(id: number) {
    return this.http.get<ApiResponse<WorkoutSession>>(`${this.baseUrl}/getById/${id}`);
  }

  create(dto: CreateWorkoutSessionDto) {
    return this.http.post<ApiResponse<WorkoutSession>>(`${this.baseUrl}/create`, dto);
  }

  update(id: number, dto: UpdateWorkoutSessionDto) {
    return this.http.patch<ApiResponse<WorkoutSession>>(`${this.baseUrl}/update/${id}`, dto);
  }
}
