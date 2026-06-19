import type { RoutineType } from './api-response.model';

export interface Routine {
  id: number;
  name: string;
  description: string;
  frequency: number;
  type: RoutineType;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoutineDto {
  name: string;
  description: string;
  frequency: number;
  type: RoutineType;
}

export interface UpdateRoutineDto {
  name?: string;
  description?: string;
  frequency?: number;
  type?: RoutineType;
}
