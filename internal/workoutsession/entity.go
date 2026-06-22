package workoutsession

import "time"

type (
	WorkoutSession struct {
		Id           int               `json:"id" db:"id"`
		UserId       int               `json:"userId" db:"user_id"`
		StartTime    time.Time         `json:"startTime" db:"start_time"`
		EndTime      *time.Time        `json:"endTime" db:"end_time"`
		Status       SessionStatusEnum `json:"status" db:"status"`
		Observations *string           `json:"observations" db:"observations"`
	}

	Filters struct {
		UserId int
		Status SessionStatusEnum
		Order  int
	}
)
