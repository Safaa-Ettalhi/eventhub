import { pool } from '../config/database.js';

export const createRegistration = async (req, res, next) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const { eventId, participantId, status } = req.body;

    const eventResult = await client.query('SELECT * FROM events WHERE id = $1', [eventId]);
    if (eventResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Event not found' });
    }

    const event = eventResult.rows[0];
    if (event.status !== 'published') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Cannot register to a non-published event' });
    }

    const participantResult = await client.query('SELECT * FROM participants WHERE id = $1', [participantId]);
    if (participantResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Participant not found' });
    }

    const existingReg = await client.query(
      'SELECT * FROM registrations WHERE event_id = $1 AND participant_id = $2',
      [eventId, participantId]
    );
    if (existingReg.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'Participant already registered to this event' });
    }

    const countResult = await client.query(
      `SELECT COUNT(*) as count FROM registrations 
       WHERE event_id = $1 AND status IN ('pending', 'confirmed')`,
      [eventId]
    );
    const currentCount = parseInt(countResult.rows[0].count);
    if (currentCount >= event.max_participants) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Event is full' });
    }

    const result = await client.query(
      `INSERT INTO registrations (event_id, participant_id, status)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [eventId, participantId, status || 'pending']
    );

    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

export const getRegistrations = async (req, res, next) => {
  try {
    const { eventId, status } = req.query;
    let query = `
      SELECT r.*, 
             e.title as event_title,
             p.full_name as participant_name,
             p.email as participant_email
      FROM registrations r
      JOIN events e ON r.event_id = e.id
      JOIN participants p ON r.participant_id = p.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (eventId) {
      paramCount++;
      query += ` AND r.event_id = $${paramCount}`;
      params.push(eventId);
    }

    if (status) {
      paramCount++;
      query += ` AND r.status = $${paramCount}`;
      params.push(status);
    }

    query += ' ORDER BY r.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const updateRegistrationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      'UPDATE registrations SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
