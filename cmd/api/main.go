package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/JuD4Mo/gopher-gains/internal/config"
	"github.com/JuD4Mo/gopher-gains/internal/database"
	"github.com/JuD4Mo/gopher-gains/internal/exercise"
	"github.com/JuD4Mo/gopher-gains/internal/exerciseset"
	"github.com/JuD4Mo/gopher-gains/internal/router"
	"github.com/JuD4Mo/gopher-gains/internal/routine"
	"github.com/JuD4Mo/gopher-gains/internal/routineexercise"
	"github.com/JuD4Mo/gopher-gains/internal/server"
	"github.com/JuD4Mo/gopher-gains/internal/user"
	"github.com/JuD4Mo/gopher-gains/internal/userroutine"
	"github.com/JuD4Mo/gopher-gains/internal/workoutsession"
	"github.com/JuD4Mo/gopher-gains/pkg/logger"
)

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}

	appLogger := logger.NewLogger()

	ctx := context.Background()
	if err := database.Migrate(ctx, &appLogger, cfg); err != nil {
		appLogger.Fatal().Err(err).Msg("failed to run database migrations")
	}

	srv, err := server.New(cfg, &appLogger)
	if err != nil {
		appLogger.Fatal().Err(err).Msg("failed to initialize server")
	}

	exerciseRepo := exercise.NewRepository(srv.DB.Pool)
	exerciseService := exercise.NewService(exerciseRepo)
	exerciseController := exercise.NewController(exerciseService, srv)

	routineRepo := routine.NewRepository(srv.DB.Pool)
	routineService := routine.NewService(routineRepo)
	routineController := routine.NewController(routineService, srv)

	userRepo := user.NewRepository(srv.DB.Pool)
	userService := user.NewService(userRepo)
	userController := user.NewController(userService, srv)

	sessionRepo := workoutsession.NewRepository(srv.DB.Pool)
	sessionService := workoutsession.NewService(sessionRepo)
	sessionController := workoutsession.NewController(sessionService, srv)

	setRepo := exerciseset.NewRepository(srv.DB.Pool)
	setService := exerciseset.NewService(setRepo)
	setController := exerciseset.NewController(setService, srv)

	userRoutineRepo := userroutine.NewRepository(srv.DB.Pool)
	userRoutineService := userroutine.NewService(userRoutineRepo)
	userRoutineController := userroutine.NewController(userRoutineService)

	routineExerciseRepo := routineexercise.NewRepository(srv.DB.Pool)
	routineExerciseService := routineexercise.NewService(routineExerciseRepo)
	routineExerciseController := routineexercise.NewController(routineExerciseService)

	controllers := router.Controllers{
		ExerciseController:   exerciseController,
		RoutineController:    routineController,
		UserController:       userController,
		SessionController:    sessionController,
		ExerciseSetController: setController,
		UserRoutineController: userRoutineController,
		RoutineExerciseController: routineExerciseController,
	}

	r := router.NewRouter(srv, controllers)

	srv.SetupHTTPServer(r)

	go func() {
		if err := srv.Start(); err != nil {
			appLogger.Fatal().Err(err).Msg("server error")
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	appLogger.Info().Msg("shutting down server...")

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		appLogger.Fatal().Err(err).Msg("failed to shutdown server gracefully")
	}

	appLogger.Info().Msg("server stopped")
}
