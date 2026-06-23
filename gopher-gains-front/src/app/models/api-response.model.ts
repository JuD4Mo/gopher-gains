export interface PaginationMeta {
  page: number;
  perPage: number;
  pageCount: number;
  totalCount: number;
}

export interface ApiResponse<T> {
  status: number;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  status: number;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export type MuscleGroup = 'chest' | 'back' | 'legs' | 'arms' | 'delts' | 'abs';
export type SessionStatus = 'in_progress' | 'finished';
export type RoutineType = 'default' | 'customized';
