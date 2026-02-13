CREATE TABLE IF NOT EXISTS bookings (
  id            SERIAL PRIMARY KEY,
  field_id      INTEGER NOT NULL REFERENCES fields(id),
  date          DATE NOT NULL,
  start_time    TIME NOT NULL,
  end_time      TIME NOT NULL,
  booker_name   VARCHAR(255) NOT NULL,
  booker_email  VARCHAR(255) NOT NULL,
  purpose       VARCHAR(500),
  status        VARCHAR(50) DEFAULT 'confirmed',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_booking_time_range CHECK (end_time > start_time)
);

CREATE INDEX IF NOT EXISTS idx_bookings_field_date ON bookings(field_id, date);
