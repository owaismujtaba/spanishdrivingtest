import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Car, BookOpen, PenTool, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar glass">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <Car className="logo-icon" size={28} />
          <span className="logo-text text-gradient">Permiso B</span>
        </Link>
        
        <div className="navbar-links nav-actions">
          <Link 
            to="/topics" 
            className={`nav-link ${location.pathname === '/topics' ? 'active' : ''}`}
          >
            <BookOpen size={20} />
            <span>Study Topics</span>
          </Link>
          <Link 
            to="/test" 
            className={`btn btn-primary nav-btn ${location.pathname === '/test' ? 'active-btn' : ''}`}
          >
            <PenTool size={18} />
            <span>Mock Test</span>
          </Link>

          {user ? (
            <div className="user-menu">
              <span className="user-avatar">
                <User size={16} /> 
                {user.name || user.email.split('@')[0]}
              </span>
              <button onClick={logout} className="btn btn-outline btn-sm">Log Out</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Log In</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
