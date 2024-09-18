// Auth Controller
const {
  findUserByToken,
  fetchCustomersByID,
  fetchAdminByID,
} = require('../database/index');

const isAuthenticated = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: 'Not Authorized' });
    }

    const token = req.headers.authorization.split(' ')[1];
    const user = await findUserByToken(token);

    // Log the decoded user to check if the role is present
    console.log('Decoded User:', user);

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: 'Not Authorized' });
  }
};

const customerDataAuthorization = async (req, res, next) => {
  try {
    // Check both 'id' and 'customerId' in req.params
    const customerId = req.params.customerId || req.params.id;

    if (!customerId) {
      return res.status(400).json({ message: 'Customer ID is required' });
    }

    const targetUser = await fetchCustomersByID(customerId); // Fetch customer

    if (!targetUser) {
      return res.status(403).json({ message: 'Not Authorized' });
    }

    // Authorization check: Allow if the user is an admin or the customer matches the token's user
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

const adminDataAuthorization = async (req, res, next) => {
  try {
    const { id } = req.params;
    const targetUser = await fetchAdminByID(id);

    if (!targetUser) {
      return res.status(401).json({ message: 'User Not Found' });
    }

    if (req.user.role === 'customer') {
      res.status(403).json({ message: 'Not Authorized' });
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
const isAnyAdmin = (req, res, next) => {
  try {
    // Check if the authenticated user has an admin-level role
    if (
      req.user.role === 'super_admin' ||
      req.user.role === 'site_admin' ||
      req.user.role === 'admin'
    ) {
      return next(); // User is authorized, proceed to the next middleware or route
    }

    // If the user does not have the required role
    return res.status(403).json({ message: 'Forbidden' });
  } catch (error) {
    return res.status(403).json({ message: 'Forbidden' });
  }
};

// Middleware --> checks if user is site admin or higher
const isSiteAdmin = (req, res, next) => {
  try {
    console.log('User role:', req.user.role); // Check if the role is 'super_admin' or 'site_admin'
    if (req.user.role !== 'site_admin' && req.user.role !== 'super_admin') {
      throw new Error('Forbidden');
    }
    next();
  } catch (error) {
    res.status(403).json({ message: 'Forbidden' });
  }
};

// Middleware --> checks if user is a super admin
const isSuperAdmin = (req, res, next) => {
  try {
    console.log(req.user);
    if (req.user.role !== 'super_admin') {
      throw new Error('Forbidden');
    }
    next();
  } catch (error) {
    res.status(403).json({ message: 'Forbidden' });
  }
};

const canPostReviews = (req, res, next) => {
  try {
    if (
      req.user.role === 'super_admin' ||
      req.user.role === 'site_admin' ||
      req.user.role === 'admin' ||
      (req.user.role === 'customer' &&
        req.user.review_permissions === 'allowed')
    ) {
      return next(); // User is authorized, proceed to the next middleware or route
    }

    throw new Error('Forbidden');
  } catch (error) {
    res.status(403).json({ message: 'Forbidden' });
  }
};

// Middleware --> checks if user is an authorized customer or higher
const isAuthorizedCustomer = (req, res, next) => {
  try {
    if (
      req.user.role !== 'customer' &&
      req.user.role !== 'site_admin' &&
      req.user.role !== 'site_admin' &&
      req.user.role !== 'super_admin'
    ) {
      throw new Error('Forbidden');
    }
    next();
  } catch (error) {
    res.status(403).json({ message: 'Not Authorized' });
  }
};

// const validateCartOrWishlistAccess = async (req, res, next) => {
//   try {
//     // Ensure the user is authenticated
//     if (!req.user) {
//       return res.status(401).json({ message: 'Not Authorized' });
//     }

//     // Extract cart_id and wishlist_id from req.params and req.body
//     const cart_id = req.params.cartId || req.body.cartId; // Check both params and body for cartId
//     const wishlist_id = req.params.wishlistId || req.body.wishlistId; // Check both params and body for wishlistId

//     // Validate cart access
//     if (cart_id && req.user.cart_id !== cart_id) {
//       return res
//         .status(403)
//         .json({ message: 'Forbidden: Cannot access this cart' });
//     }

//     // Validate wishlist access
//     if (wishlist_id && req.user.wishlist_id !== wishlist_id) {
//       return res
//         .status(403)
//         .json({ message: 'Forbidden: Cannot access this wishlist' });
//     }

//     // If validation passes, allow the request to proceed
//     next();
//   } catch (error) {
//     res.status(403).json({ message: 'Forbidden: Access Denied' });
//   }
// };

const validateCartOrWishlistAccess = async (req, res, next) => {
  try {
    // Ensure the user is authenticated
    if (!req.user) {
      console.log('User not authenticated'); // Debugging
      return res.status(401).json({ message: 'Not Authorized' });
    }

    // Extract cart_id and wishlist_id from req.params and req.body
    const cart_id = req.params.cartId || req.body.cartId;
    const wishlist_id = req.params.wishlistId || req.body.wishlistId;

    console.log('User Cart ID:', req.user.cart_id); // Debugging
    console.log('Provided Cart ID:', cart_id); // Debugging

    // Validate cart access
    if (cart_id && req.user.cart_id !== cart_id) {
      console.log('Cart ID mismatch'); // Debugging
      return res
        .status(403)
        .json({ message: 'Forbidden: Cannot access this cart' });
    }

    // Validate wishlist access
    if (wishlist_id && req.user.wishlist_id !== wishlist_id) {
      console.log('Wishlist ID mismatch'); // Debugging
      return res
        .status(403)
        .json({ message: 'Forbidden: Cannot access this wishlist' });
    }

    // If validation passes, allow the request to proceed
    next();
  } catch (error) {
    console.error('Error in validateCartOrWishlistAccess:', error); // Debugging
    res.status(403).json({ message: 'Forbidden: Access Denied' });
  }
};

module.exports = {
  isAuthenticated,
  customerDataAuthorization,
  adminDataAuthorization,
  isAnyAdmin,
  isSiteAdmin,
  isSuperAdmin,
  canPostReviews,
  isAuthorizedCustomer,
  validateCartOrWishlistAccess,
};
