import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router = Router();

// POST /api/bookings - Create a booking with overlap prevention
router.post('/', async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const { field_id, date, start_time, end_time, booker_name, booker_email, purpose } = req.body;

    if (!field_id || !date || !start_time || !end_time || !booker_name) {
      return res.status(400).json({ error: 'field_id, date, start_time, end_time, and booker_name are required' });
    }

    if (start_time >= end_time) {
      return res.status(400).json({ error: 'end_time must be after start_time' });
    }

    await client.query('BEGIN');

    // Verify field exists and is active
    const fieldCheck = await client.query(
      'SELECT id FROM fields WHERE id = $1 AND is_active = true',
      [field_id]
    );
    if (fieldCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Field not found or inactive' });
    }

    // Check for overlapping bookings on the same field+date
    const overlapCheck = await client.query(
      `SELECT id FROM bookings
       WHERE field_id = $1 AND date = $2
         AND start_time < $4::TIME AND end_time > $3::TIME`,
      [field_id, date, start_time, end_time]
    );
    if (overlapCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'This time slot overlaps with an existing booking' });
    }

    const result = await client.query(
      `INSERT INTO bookings (field_id, date, start_time, end_time, booker_name, booker_email, purpose)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, field_id, to_char(date, 'YYYY-MM-DD') as date,
                 to_char(start_time, 'HH24:MI') as start_time,
                 to_char(end_time, 'HH24:MI') as end_time,
                 booker_name, booker_email, purpose, status, created_at`,
      [field_id, date, start_time, end_time, booker_name, booker_email || null, purpose || null]
    );

    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating booking:', err);
    res.status(500).json({ error: 'Failed to create booking' });
  } finally {
    client.release();
  }
});

// GET /api/bookings?date=YYYY-MM-DD&field_id=N - List bookings
router.get('/', async (req: Request, res: Response) => {
  try {
    const { date, field_id } = req.query;

    let query = `SELECT id, field_id, to_char(date, 'YYYY-MM-DD') as date,
                        to_char(start_time, 'HH24:MI') as start_time,
                        to_char(end_time, 'HH24:MI') as end_time,
                        booker_name, booker_email, purpose, status, created_at
                 FROM bookings WHERE 1=1`;
    const params: (string | number)[] = [];

    if (date) {
      params.push(date as string);
      query += ` AND date = $${params.length}`;
    }
    if (field_id) {
      params.push(Number(field_id));
      query += ` AND field_id = $${params.length}`;
    }

    query += ' ORDER BY date, start_time';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// DELETE /api/bookings/:id - Cancel a booking
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM bookings WHERE id = $1 RETURNING id',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Error canceling booking:', err);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

export default router;
