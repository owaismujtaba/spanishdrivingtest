import React from 'react';
import { useNavigate } from 'react-router-dom';
import topicsData from '../data/topics.json';
import { AlertTriangle, Map, ArrowRightLeft, Gauge, ShieldCheck, UserCheck, ArrowRight, RotateCcw, BookOpen } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import './Topics.css';

const iconMap = {
  AlertTriangle: <AlertTriangle size={24} />,
  Map: <Map size={24} />,
  ArrowRightLeft: <ArrowRightLeft size={24} />,
  Gauge: <Gauge size={24} />,
  ShieldCheck: <ShieldCheck size={24} />,
  UserCheck: <UserCheck size={24} />
};

const Topics = () => {
  const navigate = useNavigate();
  const { progress } = useProgress();

  return (
    <div className="container animate-fade-in">
      <div className="topics-header text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Study <span className="text-gradient">Topics</span></h1>
        <p className="text-xl text-muted">Master each section of the DGT syllabus before taking the mock exam.</p>
      </div>

      <div className="grid grid-cols-2 topics-grid">
        {topicsData.map((topic) => {
          const score = progress.scores[topic.id];
          const mistakesCount = progress.mistakes[topic.id]?.length || 0;

          return (
            <div key={topic.id} className="topic-card glass">
              <div className="topic-icon">
                {iconMap[topic.icon]}
              </div>
              <div className="topic-content">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="topic-title m-0">{topic.title}</h2>
                  {score !== undefined && (
                    <span className={`badge ${score >= 90 ? 'badge-success' : 'badge-warning'}`}>
                      Best: {score}%
                    </span>
                  )}
                </div>
                <p className="topic-desc">{topic.description}</p>
              </div>
              
              <div className="topic-actions mt-4 flex gap-3">
                <button 
                  className="btn-primary"
                  onClick={() => navigate(`/study/${topic.id}`)}
                >
                  <BookOpen size={16} /> Study
                </button>
                <button 
                  className="btn btn-primary flex-1 btn-start-topic"
                  onClick={() => navigate(`/practice/${topic.id}`)}
                >
                  Practice <ArrowRight size={16} />
                </button>
                {mistakesCount > 0 && (
                  <button 
                    className="btn btn-outline btn-start-topic"
                    title={`Review ${mistakesCount} mistakes`}
                    onClick={() => navigate(`/practice/${topic.id}?mode=mistakes`)}
                  >
                    <RotateCcw size={16} /> Mistakes ({mistakesCount})
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Topics;
