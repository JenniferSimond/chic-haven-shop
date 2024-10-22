const pool = require('../databaseConfig');
const { v4: uuidv4 } = require('uuid');

// Fetch wishlist by customer ID
const fetchWishlistAndItems = async (customerId) => {
  const client = await pool.connect();
  try {
    const SQL = `
      SELECT
        w.id AS wishlist_id,
        w.customer_id,
        w.created_at AS wishlist_created_at,
        w.modified_at AS wishlist_modified_at,
        wi.id AS wishlist_item_id,
        wi.product_id,
        wi.created_at AS wishlist_item_created_at,
        wi.modified_at AS wishlist_item_modified_at,
        p.name AS product_name,
        p.description AS product_description,
        p.price AS product_price,
        p.image AS product_image
      FROM wishlists w
      LEFT JOIN wishlist_items wi ON w.id = wi.wishlist_id
      LEFT JOIN products p ON wi.product_id = p.id
      WHERE w.customer_id = $1
      ORDER BY p.name ASC;
    `;
    const response = await client.query(SQL, [customerId]);

    if (response.rows.length === 0) {
      return null;
    }

    const wishlist = {
      id: response.rows[0].wishlist_id,
      customer_id: response.rows[0].customer_id,
      created_at: response.rows[0].wishlist_created_at,
      modified_at: response.rows[0].wislist_modified_at,
      items: response.rows[0].wishlist_item_id
        ? response.rows.map((row) => ({
            wishlist_item_id: row.wishlist_item_id,
            product_id: row.product_id,
            product_name: row.product_name,
            product_description: row.product_description,
            product_price: row.product_price,
            product_image: row.product_image,
            created_at: row.wish_item_created_at,
            modified_at: row.wishlist_item_modified_at,
          }))
        : [],
    };

    return wishlist;
  } catch (error) {
    console.error('Error fetching wishlist by customer ID', error);
    throw error;
  } finally {
    client.release();
  }
};

// Add item to wishlist
// const addItemToWishlist = async ({ wishlistId, productId }) => {
//   const client = await pool.connect();
//   try {
//     const SQL = `
//       INSERT INTO wishlist_items (id, wishlist_id, product_id, created_at, modified_at)
//       VALUES ($1, $2, $3, current_timestamp, current_timestamp)
//       RETURNING *
//     `;
//     const response = await client.query(SQL, [uuidv4(), wishlistId, productId]);
//     return response.rows[0];
//   } catch (error) {
//     console.error('Error adding item to wishlist', error);
//     throw error;
//   } finally {
//     client.release();
//   }
// };

const addItemToWishlist = async ({ wishlistId, productId }) => {
  const client = await pool.connect();
  try {
    const SQL = `
      INSERT INTO wishlist_items (id, wishlist_id, product_id, created_at, modified_at)
      VALUES ($1, $2, $3, current_timestamp, current_timestamp)
      RETURNING *;
    `;
    const response = await client.query(SQL, [uuidv4(), wishlistId, productId]);
    return response.rows[0];
  } catch (error) {
    if (error.code === '23505') {
      // PostgreSQL error code for unique constraint violation
      console.error('Duplicate item detected in the wishlist');
      throw new Error('This item is already in the wishlist');
    } else {
      console.error('Error adding item to wishlist', error);
      throw error;
    }
  } finally {
    client.release();
  }
};

// Move wishlist item to cart
const moveWishlistItemToCart = async ({
  wishlistId,
  productId,
  customerId,
}) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Delete from wishlist
    const deleteSQL = `
      DELETE FROM wishlist_items WHERE wishlist_id = $1 AND product_id = $2
    `;
    await client.query(deleteSQL, [wishlistId, productId]);

    // Add to cart
    const addToCartSQL = `
      INSERT INTO cart_items (id, cart_id, product_id, quantity, total_price, created_at, modified_at)
      SELECT uuid_generate_v4(), c.id, p.id, 1, p.price, current_timestamp, current_timestamp
      FROM carts c
      JOIN products p ON p.id = $2
      WHERE c.customer_id = $1
      RETURNING *
    `;
    const cartResponse = await client.query(addToCartSQL, [
      customerId,
      productId,
    ]);

    await client.query('COMMIT');

    return cartResponse.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error moving wishlist item to cart', error);
    throw error;
  } finally {
    client.release();
  }
};

// Delete wishlist item
const deleteWishlistItem = async ({ wishlistId, itemId }) => {
  const client = await pool.connect();
  try {
    const SQL = `
      DELETE FROM wishlist_items
      WHERE id = $2 AND wishlist_id = $1
      RETURNING *; 
    `;
    const result = await client.query(SQL, [wishlistId, itemId]);

    // Check if any rows were deleted
    if (result.rowCount === 0) {
      return { error: 'Wishlist item not found' };
    }

    return { message: 'Wishlist item deleted successfully' };
  } catch (error) {
    console.error('Error deleting wishlist item', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  fetchWishlistAndItems,
  addItemToWishlist,
  moveWishlistItemToCart,
  deleteWishlistItem,
};
