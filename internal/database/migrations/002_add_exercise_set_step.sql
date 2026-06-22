-- Write your migrate up statements here

ALTER TABLE exercise_set ADD COLUMN step_number INT;

UPDATE exercise_set es SET step_number = (
  SELECT COUNT(*) + 1 FROM exercise_set es2
  WHERE es2.wsession_id = es.wsession_id
    AND es2.exercise_id = es.exercise_id
    AND es2.id < es.id
);

ALTER TABLE exercise_set ALTER COLUMN step_number SET NOT NULL;

---- create above / drop below ----

ALTER TABLE exercise_set DROP COLUMN IF EXISTS step_number;
