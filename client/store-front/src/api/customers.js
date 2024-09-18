import { API_URL } from './apiConfig';

import { getToken } from '../components/shared/auth';

// Fetch customer data using the token stored in localStorage
const fetchAuthenticatedCustomer = async () => {
  try {
    const token = getToken(); // Retrieve the token from localStorage

    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/customers/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch customer data');
    }

    const customerData = await response.json();
    console.log('Customer Data FetchAuthenticated (API) >>-->', customerData);
    return customerData;
  } catch (error) {
    console.error('Fetch Customer Data Error:', error);
    return null; // Return null if an error occurs
  }
};

const customerLogin = async (loginCredentials) => {
  try {
    const response = await fetch(`${API_URL}/customers/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginCredentials),
    });

    const userData = await response.json();
    console.log(' User Data Login (API) >>-->', userData);
    return userData;
  } catch (error) {
    console.error('Login Error.', error);
  }
};

const customerSignup = async (signupCredentials) => {
  try {
    const response = await fetch(`${API_URL}/customers/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signupCredentials),
    });

    const newUser = await response.json();
    console.log('New User (API) >>-->', newUser);
    return newUser;
  } catch (error) {
    console.error('Signup Error.', error);
  }
};
export { fetchAuthenticatedCustomer, customerLogin, customerSignup };
