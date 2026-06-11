package exercise

import (
	"time"
)

type (
	Exercise struct {
		Id                int             `json:"id" db:"id"`
		Name              string          `json:"name" db:"name"`
		Description       string          `json:"description" db:"description"`
		ExecutionTip      string          `json:"executionTip" db:"execution_tip"`
		TargetMuscleGroup MuscleGroupEnum `json:"muscleGroup" db:"target_muscle_group"`
		CreatedAt         time.Time       `json:"createdAt" db:"created_at"`
		UpdatedAt         time.Time       `json:"updatedAt" db:"updated_at"`
	}

	Filters struct {
		Name        string
		MuscleGroup string
		Order       int
	}
)
