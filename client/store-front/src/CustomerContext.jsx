import React, { createContext, useState, useEffect } from 'react';
import { getToken, removeToken } from './components/shared/auth';
import { fetchAuthenticatedCustomer } from './api/customers';
import { useNavigate } from 'react-router-dom';

// Create the context
export const CustomerContext = createContext({});

export const CustomerProvider = ({ children }) => {
  const [customerData, setCustomerData] = useState({});
  const [loading, setLoading] = useState(true); // Loading indicator to handle asynchronous actions
  const navigate = useNavigate();

  useEffect(() => {
    const loadCustomerData = async () => {
      const token = getToken(); // Retrieve the token from localStorage

      if (token) {
        try {
          const data = await fetchAuthenticatedCustomer(); // Fetch customer data using the token
          if (data) {
            setCustomerData(data); // Set customer data in context
          } else {
            removeToken(); // Remove token if no data is returned
            navigate('/login'); // Redirect to login if there's an issue
          }
        } catch (error) {
          console.error('Error fetching customer data:', error);
          setCustomerData({});
          removeToken(); // Remove token if fetching data failed
          navigate('/login'); // Redirect to login if token is invalid
        }
      } else {
        setCustomerData({}); // Clear customer data if no token
      }

      setLoading(false); // Stop loading after data is fetched
    };

    loadCustomerData(); // Fetch customer data on component mount
  }, [navigate]);

  // Display loading spinner while fetching customer data
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <CustomerContext.Provider value={{ customerData, setCustomerData }}>
      {children}
    </CustomerContext.Provider>
  );
};
