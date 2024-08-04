// seedDatabase.js

const {
  createAdminRoles,
  createAdmin,
  createCustomer,
  createCategory,
  createProduct,
} = require('./index');

const seedDatabase = async () => {
  await createAdminRoles();

  const testAdmins = [
    {
      last_name: 'Simond',
      first_name: 'Jennifer',
      email: 'jsimond@gmail.com',
      password: 'js_password',
      role: 'super_admin',
    },
    {
      last_name: 'Stark',
      first_name: 'Tony',
      email: 'tstark@gmail.com',
      password: 'ts_password',
      role: 'site_admin',
    },
    {
      last_name: 'Barns',
      first_name: 'Bucky',
      email: 'bbarns@gmail.com',
      password: 'bb_password',
      role: 'admin',
    },
  ];

  const createdAdmins = await Promise.all(testAdmins.map(createAdmin));
  console.log('TEST ADMINS ->', createdAdmins);

  const testCustomers = [
    {
      last_name: 'Ramirez',
      first_name: 'Kimberly',
      email: 'kramirez@gmail.com',
      password: 'kr_password',
    },
    {
      last_name: 'Smith',
      first_name: 'Jane',
      email: 'jsmith@gmail.com',
      password: 'js_password',
    },
    {
      last_name: 'Peters',
      first_name: 'Joe',
      email: 'jpeters@gmail.com',
      password: 'jp_password',
    },
    {
      last_name: 'Anderson',
      first_name: 'Emily',
      email: 'eanderson@gmail.com',
      password: 'ea_password',
    },
  ];

  const createdCustomer = await Promise.all(testCustomers.map(createCustomer));
  console.log('TEST CUSTOMERS ->', createdCustomer);

  const testCategories = [
    'bottoms',
    'dresses',
    'sets',
    'suits',
    'formalwear',
    'tops',
  ];

  const createdCategory = await Promise.all(testCategories.map(createCategory));
  console.log('TEST CATEGORIES ->', createdCategory);

  const testProducts = [
    {
      name: 'Tropical Vibes sets',
      description:
        'Vibrant two-piece set with a floral pattern, featuring a crop top and a ruffled skirt. Perfect for summer outings.',
      price: 49.99,
      image: '/product-images/two-piece-skirt1.jpg',
      sku: 'TVS49S99Z0',
      categoryName: 'sets',
    },
    {
      name: 'Boho Breeze sets',
      description:
        'Off-shoulder crop top with matching high-waisted pants, featuring a delicate leaf pattern. Ideal for a relaxed yet chic look.',
      price: 54.99,
      image: '/product-images/two-piece-pants.jpg',
      sku: 'BBS54S99Z1',
      categoryName: 'sets',
    },
    {
      name: 'Elegant Dress',
      description:
        'Soft cream dress with a fitted bodice and flowy skirt, accentuated with a waist tie. A versatile piece for any occasion.',
      price: 65.99,
      image: '/product-images/soft-tan-dress.jpg',
      sku: 'ED65D99Z2',
      categoryName: 'formalwear',
    },
    {
      name: 'Island Romper',
      description:
        'Floral romper with adjustable straps and a comfortable fit, perfect for a tropical vacation.',
      price: 39.99,
      image: '/product-images/island-romper.jpg',
      sku: 'IR39R99Z3',
      categoryName: 'dresses',
    },
    {
      name: 'Halter Dress',
      description:
        'Colorful halter dress with a floral print, designed for beach parties and summer gatherings.',
      price: 58.99,
      image: '/product-images/island-dress.jpg',
      sku: 'HD58D99Z4',
      categoryName: 'dresses',
    },
    {
      name: 'Boho Princess',
      description:
        'Multi-layered boho dress with ruffles and a vibrant floral design, bringing out the inner bohemian spirit.',
      price: 79.99,
      image: '/product-images/fancy-boho-dress.jpg',
      sku: 'BP79D99Z5',
      categoryName: 'dresses',
    },
    {
      name: 'Classic Black Suit',
      description:
        'Tailored black suit with a modern cut, designed for the professional woman who means business.',
      price: 129.99,
      image: '/product-images/black-suite.jpg',
      sku: 'CBS129S99Z6',
      categoryName: 'suits',
    },
    {
      name: 'Boss Bae Suit',
      description:
        'Sleek black suit with a fitted blazer and high-waisted pants, perfect for the confident and stylish professional.',
      price: 139.99,
      image: '/product-images/boss-bae-suite.jpg',
      sku: 'BBS139S99Z7',
      categoryName: 'suits',
    },
    {
      name: 'Tweed Suit',
      description:
        'Chic tweed suit with a tailored fit, combining classic style with a contemporary twist.',
      price: 149.99,
      image: '/product-images/tweed-suite.jpg',
      sku: 'TS149S99Z8',
      categoryName: 'suits',
    },
    {
      name: 'Sandy Beige Suit',
      description:
        'Elegant beige suit with a tailored fit, perfect for a professional yet stylish look.',
      price: 119.99,
      image: '/product-images/tan-suite.jpg',
      sku: 'SBS119S99Z9',
      categoryName: 'suits',
    },
    {
      name: 'Power Black Suit',
      description:
        'Classic black suit with a sharp silhouette, ideal for making a powerful impression in any business setting.',
      price: 129.99,
      image: '/product-images/power-suite.jpg',
      sku: 'PBS129S99Z0',
      categoryName: 'suits',
    },
    {
      name: 'Golden Glam Gown',
      description:
        'Stunning golden gown with off-shoulder sleeves and a thigh-high slit, perfect for formal occasions.',
      price: 199.99,
      image: '/product-images/partyDress2.jpg',
      sku: 'GGG199F99Z1',
      categoryName: 'formalwear',
    },
    {
      name: 'Goddess Gown',
      description:
        'Dazzling two-piece set with a crop top and a high-slit skirt, covered in gold sequins.',
      price: 179.99,
      image: '/product-images/partydress1.jpg',
      sku: 'GG179F99Z2',
      categoryName: 'formalwear',
    },
    {
      name: 'Boss Lady Dress',
      description:
        'Elegant black dress with a deep V-neck and long sleeves, ideal for evening events.',
      price: 89.99,
      image: '/product-images/sophisticated1.jpg',
      sku: 'BLD89D99Z3',
      categoryName: 'formalwear',
    },
    {
      name: 'High-Waisted Jeans',
      description:
        'Trendy high-waisted blue jeans with a slim fit, perfect for casual outings.',
      price: 49.99,
      image: '/product-images/jeans6.jpg',
      sku: 'HWJ49B99Z4',
      categoryName: 'bottoms',
    },
    {
      name: 'Vintage Jeans',
      description:
        'Classic high-waisted jeans with a vintage wash, ideal for everyday wear.',
      price: 54.99,
      image: '/product-images/jeans5.jpg',
      sku: 'VJ54B99Z5',
      categoryName: 'bottoms',
    },
    {
      name: '90s Mom Jeans',
      description:
        'Stylish high-waisted jeans with distressed detailing, adding an edge to any outfit.',
      price: 59.99,
      image: '/product-images/jeans4.jpg',
      sku: '90MJ59B99Z6',
      categoryName: 'bottoms',
    },
    {
      name: 'Distressed Jeans',
      description:
        'Chic olive green crop top paired with high-waisted jeans, ideal for a casual yet stylish look.',
      price: 34.99,
      image: '/product-images/jeans2.jpg',
      sku: 'DJ34B99Z7',
      categoryName: 'bottoms',
    },
    {
      name: 'White Crop Top',
      description:
        'Trendy white crop top combined with high-waisted jeans, perfect for a fresh and modern outfit.',
      price: 34.99,
      image: '/product-images/jeans1.jpg',
      sku: 'WCT34B99Z8',
      categoryName: 'tops',
    },
    {
      name: 'Floral Sundress',
      description:
        'Beautiful sundress with a vibrant floral print, perfect for a sunny day out.',
      price: 59.99,
      image: '/product-images/reg-2.jpg',
      sku: 'FS59D99Z9',
      categoryName: 'dresses',
    },
    {
      name: 'Floral Wrap Dress',
      description:
        'Delightful ruffled dress with a floral design, bringing a touch of elegance to casual wear.',
      price: 64.99,
      image: '/product-images/register.jpg',
      sku: 'FWD64D99Z0',
      categoryName: 'dresses',
    },
    {
      name: 'Comfy Beige sets',
      description:
        'Comfortable beige set featuring a loose-fitting top and matching pants, perfect for lounging.',
      price: 49.99,
      image: '/product-images/leisure-1.jpg',
      sku: 'CBS49S99Z1',
      categoryName: 'sets',
    },
    {
      name: 'Island Bae sets',
      description:
        'Casual set featuring a floral off-shoulder top and matching skirt, perfect for a day out in nature.',
      price: 59.99,
      image: '/product-images/product1.jpg',
      sku: 'IBS59S99Z2',
      categoryName: 'sets',
    },
    {
      name: '90s Chill Dress',
      description:
        'Elegant floral dress with a deep V-neck, perfect for a garden party or summer wedding.',
      price: 69.99,
      image: '/product-images/product2.jpg',
      sku: '90CD69D99Z3',
      categoryName: 'dresses',
    },
    {
      name: 'Knit sets',
      description:
        'Relaxed beige top and pants set, ideal for comfortable and stylish home wear.',
      price: 44.99,
      image: '/product-images/movement.jpg',
      sku: 'KS44S99Z4',
      categoryName: 'sets',
    },
  ];

  const createdProducts = await Promise.all(testProducts.map(createProduct));
  console.log('Created Products ->', createdProducts);
};

module.exports = {
  seedDatabase,
};
