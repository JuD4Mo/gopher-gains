package routineexercise

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"

	"github.com/JuD4Mo/gopher-gains/internal/errs"
	"github.com/JuD4Mo/gopher-gains/pkg/sqlerr"
	"github.com/JuD4Mo/gopher-gains/pkg/validation"
	"github.com/go-chi/chi/v5"
)

type (
	Controller struct {
		service Service
	}

	Response struct {
		Status int         `json:"status"`
		Data   interface{} `json:"data,omitempty"`
	}
)

func NewController(service Service) *Controller {
	return &Controller{
		service: service,
	}
}

func (c *Controller) AddExercise(w http.ResponseWriter, r *http.Request) {
	var createDto CreateRoutineExerciseDto

	err := validation.BindAndValidate(r, &createDto)
	if err != nil {
		writeError(w, err)
		return
	}

	re, err := c.service.AddExercise(r.Context(), &createDto)
	if err != nil {
		writeError(w, err)
		return
	}

	writeJSON(w, http.StatusCreated, &Response{
		Status: http.StatusCreated,
		Data:   re,
	})
}

func (c *Controller) GetByRoutine(w http.ResponseWriter, r *http.Request) {
	routineId, _ := strconv.Atoi(chi.URLParam(r, "routineId"))

	exercises, err := c.service.GetRoutineExercises(r.Context(), routineId)
	if err != nil {
		writeError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, &Response{
		Status: http.StatusOK,
		Data:   exercises,
	})
}

func (c *Controller) UpdateStep(w http.ResponseWriter, r *http.Request) {
	routineId, _ := strconv.Atoi(chi.URLParam(r, "routineId"))
	exerciseId, _ := strconv.Atoi(chi.URLParam(r, "exerciseId"))

	var updateDto UpdateRoutineExerciseDto
	err := validation.BindAndValidate(r, &updateDto)
	if err != nil {
		writeError(w, err)
		return
	}

	re, err := c.service.UpdateStep(r.Context(), routineId, exerciseId, *updateDto.StepNumber)
	if err != nil {
		writeError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, &Response{
		Status: http.StatusOK,
		Data:   re,
	})
}

func (c *Controller) RemoveExercise(w http.ResponseWriter, r *http.Request) {
	routineId, _ := strconv.Atoi(chi.URLParam(r, "routineId"))
	exerciseId, _ := strconv.Atoi(chi.URLParam(r, "exerciseId"))

	err := c.service.RemoveExercise(r.Context(), routineId, exerciseId)
	if err != nil {
		writeError(w, err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func writeJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func writeError(w http.ResponseWriter, err error) {
	var httpErr *errs.HTTPError
	if errors.As(err, &httpErr) {
		writeJSON(w, httpErr.Status, httpErr)
		return
	}

	converted := sqlerr.HandleError(err)
	if errors.As(converted, &httpErr) {
		writeJSON(w, httpErr.Status, httpErr)
		return
	}

	writeJSON(w, http.StatusInternalServerError, errs.NewInternalServerError())
}
