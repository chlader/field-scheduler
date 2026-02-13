-- Backfill default all-day availability for existing fields that have no slots
-- This covers fields created before the auto-insert was added (e.g., seeded stadiums)

INSERT INTO availability_slots (field_id, day_of_week, start_time, end_time)
SELECT f.id, d.day, '00:00'::TIME, '23:59'::TIME
FROM fields f
CROSS JOIN generate_series(0, 6) AS d(day)
WHERE f.is_active = true
  AND NOT EXISTS (
    SELECT 1 FROM availability_slots a WHERE a.field_id = f.id
  );
