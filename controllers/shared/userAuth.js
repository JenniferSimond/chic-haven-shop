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
      return res.status(401).json({ message: 'Not Authorized' });
    }

    if (
      req.user.role === 'super_admin' ||
      req.user.role === 'site_admin' ||
      req.user.role === 'admin' ||
      (req.user.role === 'customer' && req.user.id === targetUser.id)
    ) {
      return next();
    }

    res.status(403).json({ message: 'Not Authorized' });
  } catch (error) {
    res.status(403).json({ message: 'Not Authorized' });
  }
};

// ADMIN DATA AUTHORIZATION

const adminDataAutorization = async (req, res, next) => {
  try {
    const { id } = req.params;
    const targetUser = await fetchAdminByID(id);

    if (!targetUser) {
      return res.status(401).json({ message: 'User Not Found' });
    }

    if (targetUser.role === 'customer') {
      res.status(403).json({ message: 'Not Authorized' });
    }

    if (
      req.user.id === targetUser.id ||
      req.user.role === 'super_admin' ||
      (req.user.role === 'site_admin' && targetUser.role === 'site_admin') ||
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
const adminAuthorization = async (req, res, next) => {
  try {
    const { id } = req.params;
    const targetUser = await fetchAdminByID(id);

    if (!targetUser) {
      return res.status(401).json({ message: 'User Not Found' });
    }

    if (targetUser.role === 'customer') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (
      targetUser.role === 'super_admin' ||
      targetUser.role === 'site_admin' ||
      targetUser.role === 'admin'
    ) {
      return next();
    }

    res.status(403).json({ message: 'Unauthorized' });
  } catch (error) {
    res.status(403).json({ message: 'Forbidden' });
  }
};

const upperAdminAuthorization = async (req, res, next) => {
  try {
    const { id } = req.params;
    const targetUser = await fetchAdminByID(id);

    if (!targetUser) {
      return res.status(401).json({ message: 'User Not Found' });
    }

    if (targetUser.role === 'customer' || targetUser.role === 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (targetUser.role === 'super_admin' || targetUser.role === 'site_admin') {
      return next();
    }

    res.status(403).json({ message: 'Unauthorized' });
  } catch (error) {
    res.status(403).json({ message: 'Forbidden' });
  }
};

module.exports = {
  isAuthenticated,
  customerDataAuthorization,
  adminDataAutorization,
  adminAuthorization,
  upperAdminAuthorization,
};
