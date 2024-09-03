import { API_URL } from './apiConfig';

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
    console.log(' User Data (API) >>-->', userData);
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
export { customerLogin, customerSignup };
