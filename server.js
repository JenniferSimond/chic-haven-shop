// server,js

const express = require('express');
const cors = require('cors');
const { pool, createTables } = require('./database/tables');
const { seedDatabase } = require('./database/seedDatabase');

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());

const admins = require('./controllers/adminController');

app.use('/api/admin', admins);

const init = async () => {
  try {
    console.log('Initializing database and server...');
    await createTables();
    console.log('Tables created (if not already present). Starting server...');
    await seedDatabase();
    console.log('Database seeded');

    app.listen(port, () => {
      console.log(`Listening on ${port}`);
    });
  } catch (error) {
    console.error('Server Error', error);
  } finally {
    console.log('Shutting down connection pool...');
  }
};

init();
