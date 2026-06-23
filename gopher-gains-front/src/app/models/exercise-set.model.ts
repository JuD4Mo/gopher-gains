export interface ExerciseSet {
  id: number;
  wsessionId: number;
  exerciseId: number;
  weight: number;
  repetitions: number;
  rir: number;
  createdAt: string;
}

export interface CreateExerciseSetDto {
  wsessionId: number;
  exerciseId: number;
  weight: number;
  repetitions: number;
  rir?: number;
}

export interface UpdateExerciseSetDto {
  weight?: number;
  repetitions?: number;
  rir?: number;
}
