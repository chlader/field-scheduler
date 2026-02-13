import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router = Router();

// GET /api/fields/:id/availability - Get recurring slots for a field
router.get('/fields/:id/availability', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT id, field_id, day_of_week,
              to_char(start_time, 'HH24:MI') as start_time,
              to_char(end_time, 'HH24:MI') as end_time,
              created_at
       FROM availability_slots
       WHERE field_id = $1
       ORDER BY day_of_week, start_time`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching availability:', err);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});

// POST /api/fields/:id/availability - Add an availability slot
router.post('/fields/:id/availability', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { day_of_week, start_time, end_time } = req.body;

    if (day_of_week === undefined || !start_time || !end_time) {
      return res.status(400).json({ error: 'day_of_week, start_time, and end_time are required' });
    }

    if (day_of_week < 0 || day_of_week > 6) {
      return res.status(400).json({ error: 'day_of_week must be between 0 and 6' });
    }

    if (start_time >= end_time) {
      return res.status(400).json({ error: 'end_time must be after start_time' });
    }

    // Verify field exists
    const fieldCheck = await pool.query('SELECT id FROM fields WHERE id = $1', [id]);
    if (fieldCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Field not found' });
    }

    const result = await pool.query(
      `INSERT INTO availability_slots (field_id, day_of_week, start_time, end_time)
       VALUES ($1, $2, $3, $4)
       RETURNING id, field_id, day_of_week,
                 to_char(start_time, 'HH24:MI') as start_time,
                 to_char(end_time, 'HH24:MI') as end_time,
                 created_at`,
      [id, day_of_week, start_time, end_time]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating availability slot:', err);
    res.status(500).json({ error: 'Failed to create availability slot' });
  }
});

// DELETE /api/availability/:slotId - Remove an availability slot
router.delete('/availability/:slotId', async (req: Request, res: Response) => {
  try {
    const { slotId } = req.params;
    const result = await pool.query(
      'DELETE FROM availability_slots WHERE id = $1 RETURNING id',
      [slotId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Slot not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting availability slot:', err);
    res.status(500).json({ error: 'Failed to delete availability slot' });
  }
});

// GET /api/availability/week?date=YYYY-MM-DD - Get resolved weekly availability
router.get('/availability/week', async (req: Request, res: Response) => {
  try {
    const dateParam = req.query.date as string;
    if (!dateParam) {
      return res.status(400).json({ error: 'date query parameter is required (YYYY-MM-DD)' });
    }

    const requestDate = new Date(dateParam + 'T00:00:00');
    if (isNaN(requestDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
    }

    // Find the Sunday of the week containing the requested date
    const dayOfWeek = requestDate.getDay(); // 0=Sunday
    const weekStart = new Date(requestDate);
    weekStart.setDate(requestDate.getDate() - dayOfWeek);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    // Get all active fields with their availability slots
    const result = await pool.query(
      `SELECT f.id as field_id, f.name as field_name,
              a.day_of_week,
              to_char(a.start_time, 'HH24:MI') as start_time,
              to_char(a.end_time, 'HH24:MI') as end_time
       FROM fields f
       LEFT JOIN availability_slots a ON a.field_id = f.id
       WHERE f.is_active = true
       ORDER BY f.name, a.day_of_week, a.start_time`
    );

    // Group by field and resolve into concrete dates
    const fieldsMap = new Map<number, { fieldId: number; fieldName: string; slots: Array<{ date: string; startTime: string; endTime: string }> }>();

    for (const row of result.rows) {
      if (!fieldsMap.has(row.field_id)) {
        fieldsMap.set(row.field_id, {
          fieldId: row.field_id,
          fieldName: row.field_name,
          slots: [],
        });
      }

      if (row.day_of_week !== null) {
        // Resolve the recurring slot to a concrete date within this week
        const slotDate = new Date(weekStart);
        slotDate.setDate(weekStart.getDate() + row.day_of_week);

        fieldsMap.get(row.field_id)!.slots.push({
          date: formatDate(slotDate),
          startTime: row.start_time,
          endTime: row.end_time,
        });
      }
    }

    // Get bookings for this week
    const bookingsResult = await pool.query(
      `SELECT id, field_id, date,
              to_char(start_time, 'HH24:MI') as start_time,
              to_char(end_time, 'HH24:MI') as end_time,
              booker_name, booker_email, purpose, status
       FROM bookings
       WHERE date >= $1::DATE AND date <= $2::DATE
       ORDER BY date, start_time`,
      [formatDate(weekStart), formatDate(weekEnd)]
    );

    const bookings = bookingsResult.rows.map((row: { id: number; field_id: number; date: string; start_time: string; end_time: string; booker_name: string; booker_email: string | null; purpose: string | null; status: string }) => ({
      id: row.id,
      fieldId: row.field_id,
      date: typeof row.date === 'string' ? row.date : new Date(row.date).toISOString().split('T')[0],
      startTime: row.start_time,
      endTime: row.end_time,
      bookerName: row.booker_name,
      ...(row.booker_email ? { bookerEmail: row.booker_email } : {}),
      ...(row.purpose ? { purpose: row.purpose } : {}),
      status: row.status,
    }));

    res.json({
      weekStart: formatDate(weekStart),
      weekEnd: formatDate(weekEnd),
      fields: Array.from(fieldsMap.values()),
      bookings,
    });
  } catch (err) {
    console.error('Error fetching week availability:', err);
    res.status(500).json({ error: 'Failed to fetch week availability' });
  }
});

export default router;
