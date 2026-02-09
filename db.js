require('dotenv').config();
const Pool = require('pg').Pool;

// Environment-based database configuration
const pool = process.env.NODE_ENV === 'production'
  ? new Pool({
      connectionString: process.env.POSTGRES_URL + "?sslmode=require",
    })
  : new Pool({
      user: process.env.DB_USER,
      password: process.env.PASSWORD,
      host: process.env.HOST,
      port: process.env.PORT,
      database: process.env.DATABASE,
    });

module.exports = pool;