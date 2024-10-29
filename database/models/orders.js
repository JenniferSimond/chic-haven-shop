const pool = require('../database').pool;
const { v4: uuidv4 } = require('uuid');
const secret = process.env.JWT_SECRET || 'shhhlocal';
const jwt = require('jsonwebtoken');

// --> order automatically created during checkout

// --> Update Order
const updateOrder = async () => {
  const client = await pool.connect();

  try {
    const SQL = `
        
        `;
  } catch (error) {
  } finally {
  }
};
// -- Delete Order

const deleteOrder = async () => {
  const client = await pool.connect();

  try {
    const SQL = `
        
        `;
  } catch (error) {
  } finally {
  }
};
