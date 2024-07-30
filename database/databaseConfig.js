const pg = require('pg');

const dotenv = require('dotenv').config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // max users at once
  idleTimeoutMillis: 3000, // How long client can sit idle in pool and not be checked out before connected
  connectionTimeoutMillis: 2000, // How long it takes before timeout when connecting to client
  maxUses: 7500,
});

// Handle pool errors
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;
