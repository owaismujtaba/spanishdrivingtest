import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // In a real app, this would hit an API. Here we check localStorage.
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      // Don't store password in active session for security best practices (even though it's local)
      const sessionUser = { email: foundUser.email, name: foundUser.name };
      setUser(sessionUser);
      localStorage.setItem('currentUser', JSON.stringify(sessionUser));
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const register = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'User with this email already exists' };
    }
    
    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Automatically log in after registration
    const sessionUser = { email, name };
    setUser(sessionUser);
    localStorage.setItem('currentUser', JSON.stringify(sessionUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
