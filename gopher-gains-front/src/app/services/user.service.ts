import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import type { ApiResponse } from '../models/api-response.model';
import type { User, CreateUserDto, UpdateUserDto } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/users`;

  getAll(params?: { name?: string; lastName?: string; email?: string; order?: string; limit?: number; page?: number }) {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) httpParams = httpParams.set(k, String(v));
      });
    }
    return this.http.get<ApiResponse<User[]>>(`${this.baseUrl}/getAll`, { params: httpParams });
  }

  getById(id: number) {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/getById/${id}`);
  }

  create(dto: CreateUserDto) {
    return this.http.post<ApiResponse<User>>(`${this.baseUrl}/create`, dto);
  }

  update(id: number, dto: UpdateUserDto) {
    return this.http.patch<ApiResponse<User>>(`${this.baseUrl}/update/${id}`, dto);
  }
}
