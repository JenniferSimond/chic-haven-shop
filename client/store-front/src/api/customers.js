import { API_URL } from './apiConfig';

import { getToken } from '../components/shared/auth';

const fetchAuthenticatedCustomer = async () => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/customers/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch customer data');
    }

    const customerData = await response.json();
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
    return newUser;
  } catch (error) {
    console.error('Signup Error.', error);
  }
};

const fetchCustomer = async (customerId, token) => {
  try {
    const response = await fetch(`${API_URL}/customers/${customerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const customerData = await response.json();
    return customerData;
  } catch (error) {
    console.error('Error fetching customer', error);
  }
};

// update Customer Info
const updateCustomer = async (customerId, newCustomerData, token) => {
  try {
    const response = await fetch(`${API_URL}/customers/${customerId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newCustomerData),
    });

    const updatedCustomerData = await response.json();
    return updatedCustomerData;
  } catch (error) {
    console.error('Error updating customer data', error);
  }
};

// Fetch specific customer address by customer ID
const fetchCustomerAddress = async (customerId) => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/customers/${customerId}/address`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch customer address');
    }

    const address = await response.json();
    return address;
  } catch (error) {
    console.error('Fetch Customer Address Error:', error);
    return null;
  }
};

// Update customer address by customer ID
const updateCustomerAddress = async (customerId, newAddressData, token) => {
  try {
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/customers/${customerId}/address`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newAddressData),
    });

    if (!response.ok) {
      throw new Error('Failed to update address');
    }

    const updatedAddress = await response.json();
    return updatedAddress;
  } catch (error) {
    console.error('Update Address Error:', error);
    return null;
  }
};

export {
  fetchAuthenticatedCustomer,
  customerLogin,
  customerSignup,
  fetchCustomer,
  updateCustomer,
  fetchCustomerAddress,
  updateCustomerAddress,
};
