package exerciseset

import "time"

type (
	ExerciseSet struct {
		Id          int       `json:"id" db:"id"`
		WsessionId  int       `json:"wsessionId" db:"wsession_id"`
		ExerciseId  int       `json:"exerciseId" db:"exercise_id"`
		Weight      float64   `json:"weight" db:"weight"`
		Repetitions int       `json:"repetitions" db:"repetitions"`
		Rir         int       `json:"rir" db:"rir"`
		CreatedAt   time.Time `json:"createdAt" db:"created_at"`
	}

	Filters struct {
		WsessionId int
		ExerciseId int
		Order      int
	}
)
