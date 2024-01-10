require('dotenv').config();
const Pool = require('pg').Pool;

// const pool = new Pool({
//   user: process.env.DB_USER,
//   password: process.env.PASSWORD,
//   host: process.env.HOST,
//   port: process.env.PORT,
//   database: process.env.DATABASE,
// })

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
})

module.exports = pool