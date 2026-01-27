import bcrypt from 'bcrypt';
import { pool } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const seed = async () => {
  try {
    console.log(' Starting database seeding...');

    await pool.query('TRUNCATE TABLE registrations, events, participants, users CASCADE');

    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const adminUser = await pool.query(
      `INSERT INTO users (email, password, role, full_name)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      ['admin@eventhub.ma', hashedPassword, 'admin', 'Ahmed Alami']
    );

    const staffUser = await pool.query(
      `INSERT INTO users (email, password, role, full_name)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      ['staff@eventhub.ma', hashedPassword, 'staff', 'Fatima Benali']
    );

    console.log(' Users created');


    const events = [
      {
        title: 'Festival des Musiques du Monde - Fès',
        description: 'Grand festival annuel de musique traditionnelle et moderne dans la ville impériale de Fès',
        location: 'Fès, Place Boujloud',
        eventDate: new Date('2025-03-15T19:00:00'),
        maxParticipants: 500,
        status: 'published',
        createdBy: adminUser.rows[0].id,
      },
      {
        title: 'Conférence Tech Morocco 2025',
        description: 'Conférence sur les technologies émergentes et l\'innovation au Maroc',
        location: 'Casablanca, Technopark',
        eventDate: new Date('2025-04-20T09:00:00'),
        maxParticipants: 200,
        status: 'published',
        createdBy: adminUser.rows[0].id,
      },
      {
        title: 'Salon du Livre de Rabat',
        description: 'Salon international du livre avec auteurs marocains et internationaux',
        location: 'Rabat, OLM Souissi',
        eventDate: new Date('2025-05-10T10:00:00'),
        maxParticipants: 300,
        status: 'published',
        createdBy: staffUser.rows[0].id,
      },
      {
        title: 'Workshop Artisanat Traditionnel',
        description: 'Atelier de découverte de l\'artisanat marocain : poterie, zellige, tapis',
        location: 'Marrakech, Médina',
        eventDate: new Date('2025-06-05T14:00:00'),
        maxParticipants: 25,
        status: 'draft',
        createdBy: staffUser.rows[0].id,
      },
      {
        title: 'Festival Gnaoua d\'Essaouira',
        description: 'Festival de musique Gnaoua et musiques du monde',
        location: 'Essaouira, Place Moulay Hassan',
        eventDate: new Date('2025-07-20T18:00:00'),
        maxParticipants: 1000,
        status: 'cancelled',
        createdBy: adminUser.rows[0].id,
      },
    ];

    const createdEvents = [];
    for (const event of events) {
      const result = await pool.query(
        `INSERT INTO events (title, description, location, event_date, max_participants, status, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [event.title, event.description, event.location, event.eventDate, event.maxParticipants, event.status, event.createdBy]
      );
      createdEvents.push(result.rows[0]);
    }

    console.log(' Events created');

    const participants = [
      {
        fullName: 'Youssef Alaoui',
        email: 'youssef.alaoui@email.ma',
        phone: '+212 612 345 678',
      },
      {
        fullName: 'Aicha Benjelloun',
        email: 'aicha.benjelloun@email.ma',
        phone: '+212 622 456 789',
      },
      {
        fullName: 'Mehdi El Fassi',
        email: 'mehdi.elfassi@email.ma',
        phone: '+212 633 567 890',
      },
      {
        fullName: 'Sanae Tazi',
        email: 'sanae.tazi@email.ma',
        phone: '+212 644 678 901',
      },
      {
        fullName: 'Omar Idrissi',
        email: 'omar.idrissi@email.ma',
        phone: '+212 655 789 012',
      },
      {
        fullName: 'Laila Amrani',
        email: 'laila.amrani@email.ma',
        phone: '+212 666 890 123',
      },
      {
        fullName: 'Karim Bensaid',
        email: 'karim.bensaid@email.ma',
        phone: '+212 677 901 234',
      },
      {
        fullName: 'Nadia Cherkaoui',
        email: 'nadia.cherkaoui@email.ma',
        phone: '+212 688 012 345',
      },
      {
        fullName: 'Hassan El Ouazzani',
        email: 'hassan.elouazzani@email.ma',
        phone: '+212 699 123 456',
      },
      {
        fullName: 'Imane Bennani',
        email: 'imane.bennani@email.ma',
        phone: '+212 600 234 567',
      },
    ];

    const createdParticipants = [];
    for (const participant of participants) {
      const result = await pool.query(
        `INSERT INTO participants (full_name, email, phone)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [participant.fullName, participant.email, participant.phone]
      );
      createdParticipants.push(result.rows[0]);
    }

    console.log(' Participants created');

    const registrations = [
      { eventId: createdEvents[0].id, participantId: createdParticipants[0].id, status: 'confirmed' },
      { eventId: createdEvents[0].id, participantId: createdParticipants[1].id, status: 'confirmed' },
      { eventId: createdEvents[0].id, participantId: createdParticipants[2].id, status: 'pending' },
      { eventId: createdEvents[0].id, participantId: createdParticipants[3].id, status: 'confirmed' },
      { eventId: createdEvents[0].id, participantId: createdParticipants[4].id, status: 'confirmed' },
      { eventId: createdEvents[0].id, participantId: createdParticipants[5].id, status: 'pending' },
      { eventId: createdEvents[0].id, participantId: createdParticipants[6].id, status: 'confirmed' },
      { eventId: createdEvents[0].id, participantId: createdParticipants[7].id, status: 'confirmed' },
      
      { eventId: createdEvents[1].id, participantId: createdParticipants[0].id, status: 'confirmed' },
      { eventId: createdEvents[1].id, participantId: createdParticipants[2].id, status: 'confirmed' },
      { eventId: createdEvents[1].id, participantId: createdParticipants[6].id, status: 'pending' },
      { eventId: createdEvents[1].id, participantId: createdParticipants[8].id, status: 'confirmed' },
      { eventId: createdEvents[1].id, participantId: createdParticipants[9].id, status: 'confirmed' },
      
      { eventId: createdEvents[2].id, participantId: createdParticipants[1].id, status: 'confirmed' },
      { eventId: createdEvents[2].id, participantId: createdParticipants[3].id, status: 'confirmed' },
      { eventId: createdEvents[2].id, participantId: createdParticipants[5].id, status: 'pending' },
      { eventId: createdEvents[2].id, participantId: createdParticipants[7].id, status: 'confirmed' },
      

      { eventId: createdEvents[3].id, participantId: createdParticipants[4].id, status: 'pending' },
      { eventId: createdEvents[3].id, participantId: createdParticipants[8].id, status: 'pending' },

      { eventId: createdEvents[4].id, participantId: createdParticipants[9].id, status: 'cancelled' },
    ];

    for (const registration of registrations) {
      await pool.query(
        `INSERT INTO registrations (event_id, participant_id, status)
         VALUES ($1, $2, $3)`,
        [registration.eventId, registration.participantId, registration.status]
      );
    }

    console.log(' Registrations created');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n Summary:');
    console.log(`   - Users: 2 (1 admin, 1 staff)`);
    console.log(`   - Events: ${createdEvents.length} (${events.filter(e => e.status === 'published').length} published, ${events.filter(e => e.status === 'draft').length} draft, ${events.filter(e => e.status === 'cancelled').length} cancelled)`);
    console.log(`   - Participants: ${createdParticipants.length}`);
    console.log(`   - Registrations: ${registrations.length}`);
    console.log('\n🔑 Test Credentials:');
    console.log('   Admin: admin@eventhub.ma / password123');
    console.log('   Staff: staff@eventhub.ma / password123');
  } catch (error) {
    console.error(' Error seeding database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

seed();
