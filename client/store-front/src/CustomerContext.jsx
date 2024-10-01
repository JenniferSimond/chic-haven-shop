import React, { createContext, useState, useEffect } from 'react';
import { getToken, removeToken } from './components/shared/auth';
import { fetchAuthenticatedCustomer } from './api/customers';
import { useNavigate } from 'react-router-dom';

// Create the context
export const CustomerContext = createContext({});

export const CustomerProvider = ({ children }) => {
  const [customerData, setCustomerData] = useState({});
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const loadCustomerData = async () => {
      const token = getToken(); 

      if (token) {
        try {
          const data = await fetchAuthenticatedCustomer(); 
          if (data) {
            setCustomerData(data); 
          } else {
            removeToken(); 
            navigate('/login'); 
          }
        } catch (error) {
          console.error('Error fetching customer data:', error);
          setCustomerData({});
          removeToken(); 
          navigate('/login'); 
        }
      } else {
        setCustomerData({}); 
      }

      setLoading(false);
    };

    loadCustomerData(); 
  }, [navigate]);

  
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <CustomerContext.Provider value={{ customerData, setCustomerData }}>
      {children}
    </CustomerContext.Provider>
  );
};
