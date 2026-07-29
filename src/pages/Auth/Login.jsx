import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn } from 'lucide-react';
import './Auth.css'; // Shared auth styles

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/topics';

  React.useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const result = login(email, password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-card glass">
        <div className="auth-header">
          <div className="auth-icon-wrapper">
            <LogIn size={32} />
          </div>
          <h2 className="text-3xl font-bold">Welcome Back</h2>
          <p className="text-muted mt-2">Log in to continue your driving studies</p>
        </div>
        
        {error && <div className="auth-error animate-fade-in">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="btn btn-primary auth-submit">
            Log In
          </button>
        </form>
        
        <div className="auth-footer mt-6 text-center">
          <p className="text-muted">
            Don't have an account? <Link to="/signup" className="text-primary font-semibold hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
