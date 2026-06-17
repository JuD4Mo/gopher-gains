package routine

import "time"

type (
	Routine struct {
		Id          int             `json:"id" db:"id"`
		Name        string          `json:"name" db:"name"`
		Description string          `json:"description" db:"description"`
		Frequency   int             `json:"frequency" db:"frequency"`
		RoutineType RoutineTypeEnum `json:"type" db:"type"`
		CreatedAt   time.Time       `json:"createdAt" db:"created_at"`
		UpdatedAt   time.Time       `json:"updatedAt" db:"updated_at"`
	}

	Filters struct {
		Name        string
		Frequency   int
		RoutineType RoutineTypeEnum
		Order       int
	}
)
