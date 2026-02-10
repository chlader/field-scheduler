CREATE TABLE IF NOT EXISTS fields (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(255) NOT NULL,
  field_type    VARCHAR(100) NOT NULL,
  surface       VARCHAR(100),
  location      VARCHAR(500),
  amenities     TEXT[] DEFAULT '{}',
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS availability_slots (
  id            SERIAL PRIMARY KEY,
  field_id      INTEGER NOT NULL REFERENCES fields(id) ON DELETE CASCADE,
  day_of_week   SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time    TIME NOT NULL,
  end_time      TIME NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

CREATE INDEX IF NOT EXISTS idx_availability_field ON availability_slots(field_id);
CREATE INDEX IF NOT EXISTS idx_availability_day ON availability_slots(day_of_week);
