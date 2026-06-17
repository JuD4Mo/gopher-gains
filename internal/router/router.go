package router

import (
	"net/http"

	"github.com/JuD4Mo/gopher-gains/internal/exercise"
	"github.com/JuD4Mo/gopher-gains/internal/exerciseset"
	"github.com/JuD4Mo/gopher-gains/internal/item"
	"github.com/JuD4Mo/gopher-gains/internal/middleware"
	"github.com/JuD4Mo/gopher-gains/internal/routine"
	"github.com/JuD4Mo/gopher-gains/internal/routineexercise"
	"github.com/JuD4Mo/gopher-gains/internal/server"
	"github.com/JuD4Mo/gopher-gains/internal/user"
	"github.com/JuD4Mo/gopher-gains/internal/userroutine"
	"github.com/JuD4Mo/gopher-gains/internal/workoutsession"

	"github.com/go-chi/chi/v5"
)

type Controllers struct {
	ExerciseController   *exercise.Controller
	RoutineController    *routine.Controller
	UserController       *user.Controller
	SessionController    *workoutsession.Controller
	ExerciseSetController *exerciseset.Controller
	UserRoutineController *userroutine.Controller
	RoutineExerciseController *routineexercise.Controller
	itemCtrl             *item.Controller
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
		r.Mount("/routine", routineRoutes(controllers.RoutineController))
		r.Mount("/users", userRoutes(controllers.UserController))
		r.Mount("/sessions", sessionRoutes(controllers.SessionController))
		r.Mount("/sets", exerciseSetRoutes(controllers.ExerciseSetController))
		r.Mount("/user-routines", userRoutineRoutes(controllers.UserRoutineController))
		r.Mount("/routine-exercises", routineExerciseRoutes(controllers.RoutineExerciseController))
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

func routineRoutes(ctrl *routine.Controller) chi.Router {
	r := chi.NewRouter()
	r.Post("/create", ctrl.Create)
	r.Get("/getAll", ctrl.GetAll)
	r.Get("/getById/{id}", ctrl.GetById)
	r.Patch("/update/{id}", ctrl.Update)
	return r
}

func userRoutes(ctrl *user.Controller) chi.Router {
	r := chi.NewRouter()
	r.Post("/create", ctrl.Create)
	r.Get("/getAll", ctrl.GetAll)
	r.Get("/getById/{id}", ctrl.GetById)
	r.Patch("/update/{id}", ctrl.Update)
	return r
}

func sessionRoutes(ctrl *workoutsession.Controller) chi.Router {
	r := chi.NewRouter()
	r.Post("/create", ctrl.Create)
	r.Get("/getAll", ctrl.GetAll)
	r.Get("/getById/{id}", ctrl.GetById)
	r.Patch("/update/{id}", ctrl.Update)
	return r
}

func exerciseSetRoutes(ctrl *exerciseset.Controller) chi.Router {
	r := chi.NewRouter()
	r.Post("/create", ctrl.Create)
	r.Get("/getAll", ctrl.GetAll)
	r.Get("/getById/{id}", ctrl.GetById)
	r.Patch("/update/{id}", ctrl.Update)
	return r
}

func userRoutineRoutes(ctrl *userroutine.Controller) chi.Router {
	r := chi.NewRouter()
	r.Post("/assign", ctrl.Assign)
	r.Get("/byUser/{userId}", ctrl.GetByUser)
	r.Get("/byRoutine/{routineId}", ctrl.GetByRoutine)
	return r
}

func routineExerciseRoutes(ctrl *routineexercise.Controller) chi.Router {
	r := chi.NewRouter()
	r.Post("/add", ctrl.AddExercise)
	r.Get("/byRoutine/{routineId}", ctrl.GetByRoutine)
	r.Patch("/updateStep/{routineId}/{exerciseId}", ctrl.UpdateStep)
	r.Delete("/remove/{routineId}/{exerciseId}", ctrl.RemoveExercise)
	return r
}

func itemRoutes(ctrl *item.Controller) chi.Router {
	r := chi.NewRouter()
	r.Post("/", ctrl.Create)
	r.Get("/{id}", ctrl.GetByID)
	return r
}
