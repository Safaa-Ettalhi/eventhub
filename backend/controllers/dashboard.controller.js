import { pool } from '../config/database.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalEventsResult = await pool.query('SELECT COUNT(*) as count FROM events');
    const totalEvents = parseInt(totalEventsResult.rows[0].count);

    const publishedEventsResult = await pool.query(
      "SELECT COUNT(*) as count FROM events WHERE status = 'published'"
    );
    const publishedEvents = parseInt(publishedEventsResult.rows[0].count);

    const todayRegistrationsResult = await pool.query(
      `SELECT COUNT(*) as count FROM registrations 
       WHERE DATE(created_at) = CURRENT_DATE`
    );
    const todayRegistrations = parseInt(todayRegistrationsResult.rows[0].count);

    const topEventsResult = await pool.query(`
      SELECT 
        e.id,
        e.title,
        e.max_participants,
        COUNT(r.id) FILTER (WHERE r.status IN ('pending', 'confirmed')) as current_count,
        ROUND(
          (COUNT(r.id) FILTER (WHERE r.status IN ('pending', 'confirmed'))::numeric / 
           NULLIF(e.max_participants, 0)) * 100, 
          2
        ) as fill_percentage
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id
      WHERE e.status = 'published'
      GROUP BY e.id, e.title, e.max_participants
      ORDER BY fill_percentage DESC, current_count DESC
      LIMIT 5
    `);

    res.json({
      totalEvents,
      publishedEvents,
      todayRegistrations,
      topEvents: topEventsResult.rows,
    });
  } catch (error) {
    next(error);
  }
};
