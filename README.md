# gopher-gains

A lightweight Go API for tracking weight and rep progress across gym sessions. No bloat, no social features, no accounts — just the numbers.

Built as a hands-on project to practice Go backend development after building CLI tools.

## Requirements

- Go 1.22+

## Setup

1. Copy `.env.example` to `.env` and fill in your database config
2. Run the project

## Run

```bash
go mod tidy
go run ./cmd/api
```