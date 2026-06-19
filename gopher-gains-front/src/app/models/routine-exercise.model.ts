export interface RoutineExercise {
  routineId: number;
  exerciseId: number;
  stepNumber: number;
}

export interface CreateRoutineExerciseDto {
  routineId: number;
  exerciseId: number;
  stepNumber: number;
}

export interface UpdateRoutineExerciseDto {
  stepNumber?: number;
}
