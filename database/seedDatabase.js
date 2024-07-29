// seedDatabase.js

const { createAdminRoles, createAdmin } = require('./index');

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
};

module.exports = {
  seedDatabase,
};
