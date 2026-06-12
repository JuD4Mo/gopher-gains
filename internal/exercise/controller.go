package exercise

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"

	"github.com/JuD4Mo/gopher-gains/internal/errs"
	"github.com/JuD4Mo/gopher-gains/internal/server"
	"github.com/JuD4Mo/gopher-gains/pkg/meta"
	"github.com/JuD4Mo/gopher-gains/pkg/sqlerr"
	"github.com/JuD4Mo/gopher-gains/pkg/validation"
	"github.com/go-chi/chi/v5"
	"github.com/rs/zerolog"
)

type (
	Controller struct {
		service Service
		server  *server.Server
	}

	Response struct {
		Status int         `json:"status"`
		Data   interface{} `json:"data,omitempty"`
		Meta   *meta.Meta  `json:"meta,omitempty"`
	}
)

func NewController(service Service, server *server.Server) *Controller {
	return &Controller{
		service: service,
		server:  server,
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

	writeJSON(w, http.StatusCreated, &Response{
		Status: http.StatusCreated,
		Data:   exercise,
	})
}

func (c *Controller) GetAll(w http.ResponseWriter, r *http.Request) {
	queryParams := r.URL.Query()
	order, _ := strconv.Atoi(queryParams.Get("order"))

	filters := Filters{
		Name:        queryParams.Get("name"),
		MuscleGroup: queryParams.Get("muscleGroup"),
		Order:       order,
	}

	limit, _ := strconv.Atoi(queryParams.Get("limit"))

	page, _ := strconv.Atoi(queryParams.Get("page"))

	count, err := c.service.Count(r.Context(), filters)
	if err != nil {
		writeError(w, err)
		return
	}

	meta, err := meta.New(*c.server.Config, page, limit, count)
	if err != nil {
		writeError(w, err)
		return
	}

	exercises, err := c.service.GetAllExercises(r.Context(), filters, meta.Limit(), meta.Offset())
	if err != nil {
		writeError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, &Response{
		Status: http.StatusOK,
		Data:   exercises,
		Meta:   meta,
	})
}

func (c *Controller) GetById(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	idInt, _ := strconv.Atoi(id)

	exercise, err := c.service.GetExerciseById(r.Context(), idInt)
	if err != nil {
		writeError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, &Response{
		Status: http.StatusOK,
		Data:   exercise,
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
