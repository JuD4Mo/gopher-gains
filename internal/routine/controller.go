package routine

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
	var routineDto CreateRoutineDto
	err := validation.BindAndValidate(r, &routineDto)
	if err != nil {
		writeError(w, err)
		return
	}

	routine, err := c.service.CreateRoutine(r.Context(), &routineDto)
	if err != nil {
		writeError(w, err)
		return
	}

	writeJSON(w, http.StatusCreated, &Response{
		Status: http.StatusCreated,
		Data:   routine,
	})
}

func (c *Controller) GetAll(w http.ResponseWriter, r *http.Request) {
	queryParams := r.URL.Query()
	freq, _ := strconv.Atoi(queryParams.Get("frequency"))
	order, _ := strconv.Atoi(queryParams.Get("order"))
	filters := Filters{
		Name:        queryParams.Get("name"),
		Frequency:   freq,
		RoutineType: RoutineTypeEnum(queryParams.Get("type")),
		Order:       order,
	}

	limit, _ := strconv.Atoi(queryParams.Get("limit"))
	page, _ := strconv.Atoi(queryParams.Get("page"))
	numRoutines, err := c.service.Count(r.Context(), filters)
	if err != nil {
		writeError(w, err)
		return
	}

	meta, err := meta.New(*c.server.Config, page, limit, numRoutines)
	if err != nil {
		writeError(w, err)
		return
	}

	routines, err := c.service.GetAllRoutines(r.Context(), filters, meta.PerPage, meta.Offset())
	if err != nil {
		writeError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, &Response{
		Status: http.StatusOK,
		Data:   routines,
		Meta:   meta,
	})
}

func (c *Controller) GetById(w http.ResponseWriter, r *http.Request) {
	routineId := chi.URLParam(r, "id")
	parsedId, _ := strconv.Atoi(routineId)

	routine, err := c.service.GetRoutineById(r.Context(), parsedId)
	if err != nil {
		writeError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, &Response{
		Status: http.StatusOK,
		Data:   routine,
	})
}

func (c *Controller) Update(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	idInt, _ := strconv.Atoi(id)

	var updateRoutineDto UpdateRoutineDto
	err := validation.BindAndValidate(r, &updateRoutineDto)
	if err != nil {
		writeError(w, err)
		return
	}

	updatedRoutine, err := c.service.UpdateRoutine(r.Context(), idInt, &updateRoutineDto)
	if err != nil {
		writeError(w, err)
		return
	}

	writeJSON(w, http.StatusCreated, &Response{
		Status: http.StatusCreated,
		Data:   updatedRoutine,
	})
}

func writeJSON(w http.ResponseWriter, status int, data any) {
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
