package workoutsession

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

var logger *zerolog.Logger

func NewController(service Service, server *server.Server) *Controller {
	return &Controller{
		service: service,
		server:  server,
	}
}

func (c *Controller) Create(w http.ResponseWriter, r *http.Request) {
	var createDto CreateWorkoutSessionDto

	err := validation.BindAndValidate(r, &createDto)
	if err != nil {
		writeError(w, err)
		return
	}

	session, err := c.service.CreateSession(r.Context(), &createDto)
	if err != nil {
		writeError(w, err)
		return
	}

	writeJSON(w, http.StatusCreated, &Response{
		Status: http.StatusCreated,
		Data:   session,
	})
}

func (c *Controller) GetAll(w http.ResponseWriter, r *http.Request) {
	logger = zerolog.Ctx(r.Context())
	queryParams := r.URL.Query()
	userId, _ := strconv.Atoi(queryParams.Get("userId"))
	order, _ := strconv.Atoi(queryParams.Get("order"))

	filters := Filters{
		UserId: userId,
		Status: SessionStatusEnum(queryParams.Get("status")),
		Order:  order,
	}

	limit, _ := strconv.Atoi(queryParams.Get("limit"))
	page, _ := strconv.Atoi(queryParams.Get("page"))

	count, err := c.service.Count(r.Context(), filters)
	if err != nil {
		logger.Error().Err(err).Msg("failed to count workout sessions")
		writeError(w, err)
		return
	}

	meta, err := meta.New(*c.server.Config, page, limit, count)
	if err != nil {
		logger.Error().Err(err).Msg("failed to create metadata")
		writeError(w, err)
		return
	}

	sessions, err := c.service.GetAllSessions(r.Context(), filters, meta.Limit(), meta.Offset())
	if err != nil {
		logger.Error().Err(err).Msg("failed to getAll sessions")
		writeError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, &Response{
		Status: http.StatusOK,
		Data:   sessions,
		Meta:   meta,
	})
}

func (c *Controller) GetById(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	idInt, _ := strconv.Atoi(id)

	session, err := c.service.GetSessionById(r.Context(), idInt)
	if err != nil {
		writeError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, &Response{
		Status: http.StatusOK,
		Data:   session,
	})
}

func (c *Controller) Update(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	idInt, _ := strconv.Atoi(id)

	var updateDto UpdateWorkoutSessionDto
	err := validation.BindAndValidate(r, &updateDto)
	if err != nil {
		writeError(w, err)
		return
	}

	updatedSession, err := c.service.UpdateSession(r.Context(), idInt, &updateDto)
	if err != nil {
		writeError(w, err)
		return
	}

	writeJSON(w, http.StatusCreated, &Response{
		Status: http.StatusCreated,
		Data:   updatedSession,
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
