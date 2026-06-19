import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import type { ApiResponse } from '../models/api-response.model';
import type { UserRoutine, CreateUserRoutineDto } from '../models/user-routine.model';

@Injectable({ providedIn: 'root' })
export class UserRoutineService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/user-routines`;

  assign(dto: CreateUserRoutineDto) {
    return this.http.post<ApiResponse<UserRoutine>>(`${this.baseUrl}/assign`, dto);
  }

  getByUser(userId: number) {
    return this.http.get<ApiResponse<UserRoutine[]>>(`${this.baseUrl}/byUser/${userId}`);
  }

  getByRoutine(routineId: number) {
    return this.http.get<ApiResponse<UserRoutine[]>>(`${this.baseUrl}/byRoutine/${routineId}`);
  }
}
