import { pool } from '../config/database.js';

export const createParticipant = async (req, res, next) => {
  try {
    const { fullName, email, phone } = req.body;

    const result = await pool.query(
      `INSERT INTO participants (full_name, email, phone)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [fullName, email, phone || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const getParticipants = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM participants WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (full_name ILIKE $1 OR email ILIKE $1)';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const getParticipantById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM participants WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Participant not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const updateParticipant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const fields = [];
    const values = [];
    let paramCount = 0;

    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) {
        paramCount++;
        const dbKey = key === 'fullName' ? 'full_name' : key;
        fields.push(`${dbKey} = $${paramCount}`);
        values.push(updates[key]);
      }
    });

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    paramCount++;
    values.push(id);

    const query = `UPDATE participants SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Participant not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
