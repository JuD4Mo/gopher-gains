import type { MuscleGroup } from './api-response.model';

export interface Exercise {
  id: number;
  name: string;
  description: string;
  executionTip: string;
  muscleGroup: MuscleGroup;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExerciseDto {
  name: string;
  description: string;
  executionTip: string;
  muscleGroup: MuscleGroup;
}

export interface UpdateExerciseDto {
  name?: string;
  description?: string;
  executionTip?: string;
  muscleGroup?: MuscleGroup;
}
