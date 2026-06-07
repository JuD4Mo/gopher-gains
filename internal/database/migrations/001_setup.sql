-- Write your migrate up statements here

CREATE TYPE muscle_group_enum AS ENUM (
    'chest', 
    'back', 
    'legs', 
    'arms', 
    'delts', 
    'abs'
);

CREATE TYPE session_status_enum AS ENUM (
    'in_progress', 
    'finished'
);

CREATE TYPE routine_type_enum AS ENUM (
    'default', 
    'customized'
);

CREATE TABLE "USER" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    used_passwords VARCHAR(255)[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "EXERCISE" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    target_muscle_group muscle_group_enum NOT NULL,
    description TEXT NOT NULL,
    execution_tip TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ROUTINE" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    frequency INT NOT NULL,
    type routine_type_enum NOT NULL DEFAULT 'customized',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- relations

CREATE TABLE "USER_ROUTINE" (
    user_id INT REFERENCES "USER"(id) ON DELETE CASCADE,
    routine_id INT REFERENCES "ROUTINE"(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, routine_id) -- Llave primaria compuesta
);

CREATE TABLE "ROUTINE_EXERCISE" (
    routine_id INT REFERENCES "ROUTINE"(id) ON DELETE CASCADE,
    exercise_id INT REFERENCES "EXERCISE"(id) ON DELETE CASCADE,
    step_number INT NOT NULL, -- Atributo extra para ordenar los ejercicios en la interfaz
    PRIMARY KEY (routine_id, exercise_id) -- Llave primaria compuesta
);

CREATE TABLE "WORKOUT_SESSION" (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES "USER"(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE,
    status session_status_enum NOT NULL DEFAULT 'in_progress',
    observations TEXT
);

CREATE TABLE "EXERCISE_SET" (
    id SERIAL PRIMARY KEY,
    wsession_id INT NOT NULL REFERENCES "WORKOUT_SESSION"(id) ON DELETE CASCADE,
    exercise_id INT NOT NULL REFERENCES "EXERCISE"(id) ON DELETE RESTRICT,
    weight NUMERIC(6, 2) NOT NULL,
    repetitions INT NOT NULL,
    rir INT CHECK (rir >= 0 AND rir <= 10) DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

---- create above / drop below ----

DROP TABLE IF EXISTS "EXERCISE_SET";
DROP TABLE IF EXISTS "WORKOUT_SESSION";
DROP TABLE IF EXISTS "ROUTINE_EXERCISE";
DROP TABLE IF EXISTS "USER_ROUTINE";
DROP TABLE IF EXISTS "ROUTINE";
DROP TABLE IF EXISTS "EXERCISE";
DROP TABLE IF EXISTS "USER";

DROP TYPE IF EXISTS routine_type_enum;
DROP TYPE IF EXISTS session_status_enum;
DROP TYPE IF EXISTS muscle_group_enum;
