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

// POST /api/fields - Create a new field
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, field_type, surface, location, amenities } = req.body;
    if (!name || !field_type) {
      return res.status(400).json({ error: 'name and field_type are required' });
    }
    const result = await pool.query(
      `INSERT INTO fields (name, field_type, surface, location, amenities)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, field_type, surface || null, location || null, amenities || []]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating field:', err);
    res.status(500).json({ error: 'Failed to create field' });
  }
});

// PUT /api/fields/:id - Update a field
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, field_type, surface, location, amenities } = req.body;

    const existing = await pool.query('SELECT * FROM fields WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Field not found' });
    }

    const field = existing.rows[0];
    const result = await pool.query(
      `UPDATE fields
       SET name = $1, field_type = $2, surface = $3, location = $4, amenities = $5, updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [
        name ?? field.name,
        field_type ?? field.field_type,
        surface !== undefined ? surface : field.surface,
        location !== undefined ? location : field.location,
        amenities ?? field.amenities,
        id,
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating field:', err);
    res.status(500).json({ error: 'Failed to update field' });
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
