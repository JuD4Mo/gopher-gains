import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import type { ApiResponse } from '../models/api-response.model';
import type { Exercise, CreateExerciseDto, UpdateExerciseDto } from '../models/exercise.model';

@Injectable({ providedIn: 'root' })
export class ExerciseService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/exercise`;

  getAll(params?: { name?: string; muscleGroup?: string; order?: string; limit?: number; page?: number }) {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) httpParams = httpParams.set(k, String(v));
      });
    }
    return this.http.get<ApiResponse<Exercise[]>>(`${this.baseUrl}/getAll`, { params: httpParams });
  }

  getById(id: number) {
    return this.http.get<ApiResponse<Exercise>>(`${this.baseUrl}/getById/${id}`);
  }

  create(dto: CreateExerciseDto) {
    return this.http.post<ApiResponse<Exercise>>(`${this.baseUrl}/create`, dto);
  }

  update(id: number, dto: UpdateExerciseDto) {
    return this.http.patch<ApiResponse<Exercise>>(`${this.baseUrl}/update/${id}`, dto);
  }
}
