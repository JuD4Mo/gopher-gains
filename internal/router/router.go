package router

import (
	"net/http"

	"github.com/JuD4Mo/gopher-gains/internal/exercise"
	"github.com/JuD4Mo/gopher-gains/internal/item"
	"github.com/JuD4Mo/gopher-gains/internal/middleware"
	"github.com/JuD4Mo/gopher-gains/internal/server"

	"github.com/go-chi/chi/v5"
)

type Controllers struct {
	ExerciseController *exercise.Controller
	itemCtrl           *item.Controller
}

func NewRouter(s *server.Server, controllers Controllers) *chi.Mux {
	r := chi.NewRouter()

	globalMw := middleware.NewGlobalMiddlewares(s)

	r.Use(globalMw.Recover)
	r.Use(globalMw.RequestLogger)
	r.Use(globalMw.CORS)

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	})

	r.Route("/api/v1", func(r chi.Router) {
		r.Mount("/items", itemRoutes(controllers.itemCtrl))
		r.Mount("/exercise", exerciseRoutes(controllers.ExerciseController))
	})

	return r
}

func exerciseRoutes(ctrl *exercise.Controller) chi.Router {
	r := chi.NewRouter()
	r.Post("/create", ctrl.Create)
	r.Get("/getAll", ctrl.GetAll)
	r.Get("/getById/{id}", ctrl.GetById)
	r.Patch("/update/{id}", ctrl.Update)
	return r
}

func itemRoutes(ctrl *item.Controller) chi.Router {
	r := chi.NewRouter()
	r.Post("/", ctrl.Create)
	r.Get("/{id}", ctrl.GetByID)
	return r
}
