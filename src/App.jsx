import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Topics from './pages/Topics';
import Study from './pages/Study';
import MockTest from './pages/MockTest';
import Practice from './pages/Practice';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <Router>
          <div className="page-wrapper">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route 
                  path="/topics" 
                  element={
                    <ProtectedRoute>
                      <Topics />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/study/:topicId" 
                  element={
                    <ProtectedRoute>
                      <Study />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/practice/:topicId" 
                  element={
                    <ProtectedRoute>
                      <Practice />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/test" 
                  element={
                    <ProtectedRoute>
                      <MockTest />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ProgressProvider>
    </AuthProvider>
  );
}

export default App;
