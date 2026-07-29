import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserPlus } from 'lucide-react';
import './Auth.css';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const result = register(name, email, password);
    if (result.success) {
      navigate('/topics', { replace: true });
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-card glass">
        <div className="auth-header">
          <div className="auth-icon-wrapper">
            <UserPlus size={32} />
          </div>
          <h2 className="text-3xl font-bold">Create Account</h2>
          <p className="text-muted mt-2">Join us to start passing your driving test</p>
        </div>
        
        {error && <div className="auth-error animate-fade-in">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
            />
          </div>
          <button type="submit" className="btn btn-primary auth-submit">
            Sign Up
          </button>
        </form>
        
        <div className="auth-footer mt-6 text-center">
          <p className="text-muted">
            Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
