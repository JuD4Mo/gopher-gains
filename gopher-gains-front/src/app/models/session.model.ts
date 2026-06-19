import type { SessionStatus } from './api-response.model';

export interface WorkoutSession {
  id: number;
  userId: number;
  startTime: string;
  endTime: string | null;
  status: SessionStatus;
  observations: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkoutSessionDto {
  userId: number;
  observations?: string;
}

export interface UpdateWorkoutSessionDto {
  status?: SessionStatus;
  endTime?: string;
  observations?: string;
}
