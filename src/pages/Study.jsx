import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, CheckCircle } from 'lucide-react';
import studyData from '../data/study_material.json';
import topicsData from '../data/topics.json';
import './Study.css';

const Study = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();

  const studyMaterial = studyData.find(t => t.id === topicId);
  const topicDetails = topicsData.find(t => t.id === topicId);

  if (!studyMaterial || !topicDetails) {
    return (
      <div className="study-not-found">
        <h2>Study Material Not Found</h2>
        <button onClick={() => navigate('/topics')} className="back-btn">
          Back to Topics
        </button>
      </div>
    );
  }

  return (
    <div className="study-container">
      <div className="study-header">
        <button onClick={() => navigate('/topics')} className="back-btn">
          <ArrowLeft size={20} /> Back
        </button>
        <div className="study-title-wrapper">
          <BookOpen className="study-icon" size={28} />
          <h1>{studyMaterial.title}</h1>
        </div>
        <p className="study-description">{topicDetails.description}</p>
      </div>

      <div className="study-content">
        {studyMaterial.content.map((section, index) => (
          <div key={index} className="study-section">
            <h2>{section.heading}</h2>
            {section.image && (
              <img src={section.image} alt={section.heading} className="study-image" />
            )}
            <p>{section.text}</p>
          </div>
        ))}
      </div>

      <div className="study-footer">
        <button 
          className="practice-now-btn" 
          onClick={() => navigate(`/practice/${topicId}`)}
        >
          <CheckCircle size={20} />
          Take Practice Test
        </button>
      </div>
    </div>
  );
};

export default Study;
