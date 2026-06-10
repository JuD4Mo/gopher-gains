package exercise

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/JuD4Mo/gopher-gains/internal/errs"
	"github.com/JuD4Mo/gopher-gains/pkg/sqlerr"
	"github.com/JuD4Mo/gopher-gains/pkg/validation"
	"github.com/rs/zerolog"
)

type Controller struct {
	service Service
}

func NewController(service Service) *Controller {
	return &Controller{
		service: service,
	}
}

func (c *Controller) Create(w http.ResponseWriter, r *http.Request) {
	var exerciseDto CreateExerciseDto

	err := validation.BindAndValidate(r, &exerciseDto)
	if err != nil {
		writeError(w, err)
		return
	}

	exercise, err := c.service.CreateExercise(r.Context(), &exerciseDto)
	if err != nil {
		logger := zerolog.Ctx(r.Context())
		logger.Error().Err(err).Msg("failed to create exercise")
		writeError(w, err)
		return
	}

	writeJSON(w, http.StatusCreated, exercise)
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
