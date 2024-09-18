// server,js

const express = require('express');
const cors = require('cors');
const { pool, createTables } = require('./database/tables');
const { seedUsers, seedDatabase } = require('./database/seedDatabase');
const path = require('path');

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
    ],
    credentials: true,
  })
);

// Serve static files for the store-front
app.use(express.static(path.join(__dirname, 'client/store-front/dist')));
app.get('/store/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/store-front/dist/index.html'));
});

// Serve static files for the admin-portal
app.use(express.static(path.join(__dirname, 'client/admin-portal/dist')));
app.get('/store/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/admin-portal/dist/index.html'));
});

// Serve static files from the 'public/productImages' directory
app.use(
  '/product-images',
  express.static(path.join(__dirname, 'public/product-images'))
);

const admins = require('./controllers/adminController');
const customers = require('./controllers/customerController');
const products = require('./controllers/productController');
const inventory = require('./controllers/inventoryController');
const carts = require('./controllers/cartController');
const wishlists = require('./controllers/wishlistController');
const reviews = require('./controllers/reviewController');

app.use('/api/admins', admins);
app.use('/api/customers', customers);
app.use('/api/products', products);
app.use('/api/inventory', inventory);
app.use('/api/carts', carts);
app.use('/api/wishlists', wishlists);
app.use('/api/reviews', reviews);

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
