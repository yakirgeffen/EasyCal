const fetch = require('node-fetch');

// Test user registration
async function testRegistration() {
  try {
    const response = await fetch('http://localhost:5000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      })
    });

    const data = await response.json();
    console.log('Registration response:', data);
    
    if (data.token) {
      return data.token;
    } else {
      throw new Error('Registration failed');
    }
  } catch (error) {
    console.error('Registration error:', error);
    return null;
  }
}

// Test user login
async function testLogin() {
  try {
    const response = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    const data = await response.json();
    console.log('Login response:', data);
    
    if (data.token) {
      return data.token;
    } else {
      throw new Error('Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
}

// Test getting user profile
async function testGetProfile(token) {
  try {
    const response = await fetch('http://localhost:5000/api/users/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    console.log('Profile response:', data);
  } catch (error) {
    console.error('Get profile error:', error);
  }
}

// Run tests
async function runTests() {
  console.log('Testing user registration...');
  const registrationToken = await testRegistration();
  
  if (registrationToken) {
    console.log('Registration successful!');
    console.log('Testing get profile with registration token...');
    await testGetProfile(registrationToken);
  } else {
    console.log('Testing user login...');
    const loginToken = await testLogin();
    
    if (loginToken) {
      console.log('Login successful!');
      console.log('Testing get profile with login token...');
      await testGetProfile(loginToken);
    } else {
      console.log('Both registration and login failed.');
    }
  }
}

runTests();
