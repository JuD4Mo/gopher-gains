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

CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    used_passwords VARCHAR(255)[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exercise (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    target_muscle_group muscle_group_enum NOT NULL,
    description TEXT NOT NULL,
    execution_tip TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE routine (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    frequency INT NOT NULL,
    type routine_type_enum NOT NULL DEFAULT 'customized',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- relations

CREATE TABLE user_routine (
    user_id INT REFERENCES "user"(id) ON DELETE CASCADE,
    routine_id INT REFERENCES routine(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, routine_id)
);

CREATE TABLE routine_exercise (
    routine_id INT REFERENCES routine(id) ON DELETE CASCADE,
    exercise_id INT REFERENCES exercise(id) ON DELETE CASCADE,
    step_number INT NOT NULL,
    PRIMARY KEY (routine_id, exercise_id)
);

CREATE TABLE workout_session (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE,
    status session_status_enum NOT NULL DEFAULT 'in_progress',
    observations TEXT
);

CREATE TABLE exercise_set (
    id SERIAL PRIMARY KEY,
    wsession_id INT NOT NULL REFERENCES workout_session(id) ON DELETE CASCADE,
    exercise_id INT NOT NULL REFERENCES exercise(id) ON DELETE RESTRICT,
    weight NUMERIC(6, 2) NOT NULL,
    repetitions INT NOT NULL,
    rir INT CHECK (rir >= 0 AND rir <= 10) DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

---- create above / drop below ----

DROP TABLE IF EXISTS exercise_set;
DROP TABLE IF EXISTS workout_session;
DROP TABLE IF EXISTS routine_exercise;
DROP TABLE IF EXISTS user_routine;
DROP TABLE IF EXISTS routine;
DROP TABLE IF EXISTS exercise;
DROP TABLE IF EXISTS "user";

DROP TYPE IF EXISTS routine_type_enum;
DROP TYPE IF EXISTS session_status_enum;
DROP TYPE IF EXISTS muscle_group_enum;
