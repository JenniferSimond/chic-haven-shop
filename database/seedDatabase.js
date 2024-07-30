// seedDatabase.js

const { createAdminRoles, createAdmin, createCustomer } = require('./index');

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
};

module.exports = {
  seedDatabase,
};
