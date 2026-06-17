package routineexercise

type (
	RoutineExercise struct {
		RoutineId  int `json:"routineId" db:"routine_id"`
		ExerciseId int `json:"exerciseId" db:"exercise_id"`
		StepNumber int `json:"stepNumber" db:"step_number"`
	}
)
