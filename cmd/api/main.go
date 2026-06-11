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
	"github.com/JuD4Mo/gopher-gains/internal/router"
	"github.com/JuD4Mo/gopher-gains/internal/server"
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

	controllers := router.Controllers{
		ExerciseController: exerciseController,
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
