import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import type { ApiResponse } from '../models/api-response.model';
import type { ExerciseSet, CreateExerciseSetDto, UpdateExerciseSetDto } from '../models/exercise-set.model';

@Injectable({ providedIn: 'root' })
export class ExerciseSetService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/sets`;

  getAll(params?: { wsessionId?: number; exerciseId?: number; order?: string; limit?: number; page?: number }) {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) httpParams = httpParams.set(k, String(v));
      });
    }
    return this.http.get<ApiResponse<ExerciseSet[]>>(`${this.baseUrl}/getAll`, { params: httpParams });
  }

  getById(id: number) {
    return this.http.get<ApiResponse<ExerciseSet>>(`${this.baseUrl}/getById/${id}`);
  }

  create(dto: CreateExerciseSetDto) {
    return this.http.post<ApiResponse<ExerciseSet>>(`${this.baseUrl}/create`, dto);
  }

  update(id: number, dto: UpdateExerciseSetDto) {
    return this.http.patch<ApiResponse<ExerciseSet>>(`${this.baseUrl}/update/${id}`, dto);
  }
}
