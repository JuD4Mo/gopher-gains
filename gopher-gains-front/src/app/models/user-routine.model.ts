export interface UserRoutine {
  userId: number;
  routineId: number;
  assignedAt: string;
}

export interface CreateUserRoutineDto {
  userId: number;
  routineId: number;
}
