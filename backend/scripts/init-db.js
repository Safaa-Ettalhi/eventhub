import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { pool } from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const initDatabase = async () => {
  try {
    console.log(' Initialisation de la base de données...');

    const schemaPath = join(__dirname, '..', 'database', 'schema.sql');
    const schemaSQL = readFileSync(schemaPath, 'utf-8');

    await pool.query(schemaSQL);
    
    console.log(' Base de données initialisée avec succès !');
    process.exit(0);
  } catch (error) {
    console.error(' Erreur lors de l\'initialisation:', error.message);
    if (error.message.includes('authentification')) {
      console.error('\n Vérifiez vos identifiants PostgreSQL dans le fichier .env');
      console.error('   DB_USER et DB_PASSWORD doivent correspondre à votre configuration PostgreSQL');
    }
    process.exit(1);
  } finally {
    await pool.end();
  }
};

initDatabase();
