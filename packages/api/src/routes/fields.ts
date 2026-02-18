import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router = Router();

// GET /api/fields - List all active fields
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM fields WHERE is_active = true ORDER BY name'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching fields:', err);
    res.status(500).json({ error: 'Failed to fetch fields' });
  }
});

// GET /api/fields/:id - Get single field
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM fields WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Field not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching field:', err);
    res.status(500).json({ error: 'Failed to fetch field' });
  }
});

// POST /api/fields - Create a new field with default all-day availability
router.post('/', async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const { name, field_type, surface, location } = req.body;
    if (!name || !field_type) {
      return res.status(400).json({ error: 'name and field_type are required' });
    }

    await client.query('BEGIN');

    const result = await client.query(
      `INSERT INTO fields (name, field_type, surface, location)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, field_type, surface || null, location || null || []]
    );
    const field = result.rows[0];

    // Insert default all-day availability for every day of the week (0=Sun..6=Sat)
    await client.query(
      `INSERT INTO availability_slots (field_id, day_of_week, start_time, end_time)
       SELECT $1, d, '00:00'::TIME, '23:59'::TIME
       FROM generate_series(0, 6) AS d`,
      [field.id]
    );

    await client.query('COMMIT');
    res.status(201).json(field);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating field:', err);
    res.status(500).json({ error: 'Failed to create field' });
  } finally {
    client.release();
  }
});

// PUT /api/fields/:id - Update a field
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, field_type, surface, location } = req.body;

    const existing = await pool.query('SELECT * FROM fields WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Field not found' });
    }

    const field = existing.rows[0];
    const result = await pool.query(
      `UPDATE fields
       SET name = $1, field_type = $2, surface = $3, location = $4, updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [
        name ?? field.name,
        field_type ?? field.field_type,
        surface !== undefined ? surface : field.surface,
        location !== undefined ? location : field.location,
        id,
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating field:', err);
    res.status(500).json({ error: 'Failed to update field' });
  }
});

// GET /api/fields/:id/bookings?date=YYYY-MM-DD - Bookings for a specific field
router.get('/:id/bookings', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    let query = `SELECT id, field_id, to_char(date, 'YYYY-MM-DD') as date,
                        to_char(start_time, 'HH24:MI') as start_time,
                        to_char(end_time, 'HH24:MI') as end_time,
                        booker_name, booker_email, purpose, status, created_at
                 FROM bookings WHERE field_id = $1`;
    const params: (string | number)[] = [Number(id)];

    if (date) {
      params.push(date as string);
      query += ` AND date = $${params.length}`;
    }

    query += ' ORDER BY date, start_time';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching field bookings:', err);
    res.status(500).json({ error: 'Failed to fetch field bookings' });
  }
});

// DELETE /api/fields/:id - Soft-delete
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE fields SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Field not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting field:', err);
    res.status(500).json({ error: 'Failed to delete field' });
  }
});

export default router;
