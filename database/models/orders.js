const pool = require('../database').pool;
const { v4: uuidv4 } = require('uuid');
const secret = process.env.JWT_SECRET || 'shhhlocal';
