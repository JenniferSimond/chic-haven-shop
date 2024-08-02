// Auth Controller

const {
  authenticateAdmin,
  authenticateCustomer,
  findUserByToken,
  fetchCustomersByID,
  fetchAdminByID,
} = require('../../database/index');

// AUTHENTICATION
const isAuthenticated = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: 'Not Authorized' });
    }

    const token = req.headers.authorization.split(' ')[1];
    const user = await findUserByToken(token);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not Authorized' });
  }
};

// CUSTOMER DATA AUTHORIZATION
const customerDataAuthorization = async (req, res, next) => {
  try {
    const { id } = req.params;
    const targetUser = await fetchCustomersByID(id);

    if (!targetUser) {
      return res.status(404).json({ message: 'User Not Found' });
    }

    if (
      req.user.role === 'super_admin' ||
      req.user.role === 'site_admin' ||
      req.user.role === 'admin' ||
      (req.user.role === 'customer' && req.user.id === targetUser.id)
    ) {
      return next();
    }

    res.status(403).json({ message: 'Unauthorized' });
  } catch (error) {
    res.status(403).json({ message: 'Unauthorized' });
  }
};

// ADMIN DATA AUTHORIZATION

const adminDataAuthentication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const targetUser = await fetchAdminByID(id);

    if (!targetUser) {
      return res.status(404).json({ message: 'User Not Found' });
    }

    if (targetUser.role === 'customer') {
      res.status(403).json({ message: 'Unauthorized' });
    }

    if (
      req.user.id === targetUser.id ||
      req.user.role === 'super_admin' ||
      (req.user.role === 'site_admin' && targetUser.role === 'admin')
    ) {
      return next();
    }
    throw new Error('Forbidden');
  } catch (error) {
    res.status(403).json({ message: 'Forbidden' });
  }
};

// ADMIN LEVEL AUTHORIZATION
const isAdminAuthorization = async (req, res, next) => {};

module.exports = { isAuthenticated, customerDataAuthorization };
