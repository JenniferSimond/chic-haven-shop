import React, { createContext, useState } from 'react';

export const CustomerContext = createContext({});

export const CustomerProvider = ({ children }) => {
  const [customerData, setCustomerData] = useState({});

  return (
    <CustomerContext.Provider value={{ customerData, setCustomerData }}>
      {children}
    </CustomerContext.Provider>
  );
};
