import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Shield, Clock } from 'lucide-react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container animate-fade-in">
      <section className="hero container text-center">
        <h1 className="hero-title">
          Master the <span className="text-gradient">Permiso B</span> Exam in English
        </h1>
        <p className="hero-subtitle mb-8">
          The most effective way to study for your Spanish driving license. Premium mock tests, comprehensive topic guides, and proven strategies to help you pass on your first try.
        </p>
        <div className="hero-actions">
          <Link to="/test" className="btn btn-primary btn-lg">
            Start Mock Test <ArrowRight size={20} />
          </Link>
          <Link to="/topics" className="btn btn-secondary btn-lg">
            Study Topics
          </Link>
        </div>
      </section>

      <section className="features container mt-8">
        <div className="grid grid-cols-3">
          <div className="feature-card glass">
            <div className="feature-icon-wrapper">
              <CheckCircle2 className="feature-icon" size={32} />
            </div>
            <h3 className="feature-title">Official DGT Format</h3>
            <p className="feature-desc">Practice with 30-question tests that mirror the real exam experience, allowing up to 3 errors.</p>
          </div>
          <div className="feature-card glass">
            <div className="feature-icon-wrapper">
              <Clock className="feature-icon" size={32} />
            </div>
            <h3 className="feature-title">30-Minute Timer</h3>
            <p className="feature-desc">Get comfortable with the time pressure. Our mock tests include a realistic countdown timer.</p>
          </div>
          <div className="feature-card glass">
            <div className="feature-icon-wrapper">
              <Shield className="feature-icon" size={32} />
            </div>
            <h3 className="feature-title">Latest Syllabus</h3>
            <p className="feature-desc">All topics and questions are based on the latest traffic rules and regulations in Spain.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
