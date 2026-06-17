package userroutine

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

func (c *Controller) Assign(w http.ResponseWriter, r *http.Request) {
	var createDto CreateUserRoutineDto

	err := validation.BindAndValidate(r, &createDto)
	if err != nil {
		writeError(w, err)
		return
	}

	userRoutine, err := c.service.AssignRoutine(r.Context(), &createDto)
	if err != nil {
		writeError(w, err)
		return
	}

	writeJSON(w, http.StatusCreated, &Response{
		Status: http.StatusCreated,
		Data:   userRoutine,
	})
}

func (c *Controller) GetByUser(w http.ResponseWriter, r *http.Request) {
	userId, _ := strconv.Atoi(chi.URLParam(r, "userId"))

	routines, err := c.service.GetUserRoutines(r.Context(), userId)
	if err != nil {
		writeError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, &Response{
		Status: http.StatusOK,
		Data:   routines,
	})
}

func (c *Controller) GetByRoutine(w http.ResponseWriter, r *http.Request) {
	routineId, _ := strconv.Atoi(chi.URLParam(r, "routineId"))

	users, err := c.service.GetRoutineUsers(r.Context(), routineId)
	if err != nil {
		writeError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, &Response{
		Status: http.StatusOK,
		Data:   users,
	})
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
