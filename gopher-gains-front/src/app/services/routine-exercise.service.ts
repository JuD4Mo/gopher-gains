import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import type { ApiResponse } from '../models/api-response.model';
import type { RoutineExercise, CreateRoutineExerciseDto, UpdateRoutineExerciseDto } from '../models/routine-exercise.model';

@Injectable({ providedIn: 'root' })
export class RoutineExerciseService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/routine-exercises`;

  addExercise(dto: CreateRoutineExerciseDto) {
    return this.http.post<ApiResponse<RoutineExercise>>(`${this.baseUrl}/add`, dto);
  }

  getByRoutine(routineId: number) {
    return this.http.get<ApiResponse<RoutineExercise[]>>(`${this.baseUrl}/byRoutine/${routineId}`);
  }

  updateStep(routineId: number, exerciseId: number, dto: UpdateRoutineExerciseDto) {
    return this.http.patch<ApiResponse<RoutineExercise>>(`${this.baseUrl}/updateStep/${routineId}/${exerciseId}`, dto);
  }

  remove(routineId: number, exerciseId: number) {
    return this.http.delete<void>(`${this.baseUrl}/remove/${routineId}/${exerciseId}`);
  }
}
