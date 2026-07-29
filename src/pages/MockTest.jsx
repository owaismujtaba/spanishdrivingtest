import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, AlertCircle, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import questionsData from '../data/questions.json';
import './MockTest.css';

const MockTest = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds

  useEffect(() => {
    // Shuffle and pick 30 random questions from the dataset
    const shuffled = [...questionsData].sort(() => 0.5 - Math.random());
    const testSet = shuffled.slice(0, 30);
    // Add unique IDs for rendering
    const uniqueSet = testSet.map((q, index) => ({ ...q, id: `test-${index}` }));
    setQuestions(uniqueSet);
  }, []);

  useEffect(() => {
    if (isFinished) return;
    if (timeLeft <= 0) {
      setIsFinished(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isFinished]);

  const handleSelectAnswer = (optionIdx) => {
    setAnswers(prev => ({
      ...prev,
      [currentIdx]: optionIdx
    }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (questions.length === 0) return <div>Loading...</div>;

  if (isFinished) {
    let errors = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] !== q.correctAnswer) {
        errors++;
      }
    });
    const passed = errors <= 3;

    return (
      <div className="container test-results animate-fade-in">
        <div className={`result-card glass ${passed ? 'passed' : 'failed'}`}>
          {passed ? (
            <CheckCircle className="result-icon success" size={64} />
          ) : (
            <XCircle className="result-icon danger" size={64} />
          )}
          <h1 className="text-4xl font-bold mt-4">{passed ? 'Pass!' : 'Fail'}</h1>
          <p className="text-xl mt-2 mb-6">You made {errors} error(s).</p>
          
          <div className="result-details">
            <p className="mb-2"><strong>Total Questions:</strong> {questions.length}</p>
            <p className="mb-2"><strong>Correct Answers:</strong> {questions.length - errors}</p>
            <p className="mb-4"><strong>Maximum Allowed Errors:</strong> 3</p>
          </div>

          <div className="result-actions">
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              <RotateCcw size={18} /> Retake Test
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/topics')}>
              Study More
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  const selectedAnswer = answers[currentIdx];

  return (
    <div className="container test-layout animate-fade-in">
      {/* Main Content Area */}
      <div className="test-main">
        <div className="test-header glass-panel">
          <div className="test-progress">
            Question {currentIdx + 1} of {questions.length}
          </div>
          <div className={`test-timer ${timeLeft < 300 ? 'text-danger' : ''}`}>
            <Clock size={20} />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="progress-bar-bg mt-4 mb-8">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        <div className="question-card glass">
          {currentQ.imageUrl && (
            <div className="question-image-wrapper">
              <img src={currentQ.imageUrl} alt="Traffic Scene" className="question-image animate-fade-in" />
            </div>
          )}
          <h2 className="text-2xl font-semibold mb-6">{currentQ.question}</h2>
          <div className="options-list">
            {currentQ.options.map((option, idx) => (
              <button
                key={idx}
                className={`option-btn ${selectedAnswer === idx ? 'selected' : ''}`}
                onClick={() => handleSelectAnswer(idx)}
              >
                <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                <span className="option-text">{option}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="test-footer mt-8">
          <button 
            className="btn btn-outline" 
            onClick={handlePrev} 
            disabled={currentIdx === 0}
          >
            Previous
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleNext}
            disabled={selectedAnswer === undefined && currentIdx < questions.length - 1} // Can't go next if not answered unless it's the last one where we might submit empty
          >
            {currentIdx === questions.length - 1 ? 'Finish Test' : 'Next Question'}
          </button>
        </div>
      </div>

      {/* Sidebar Navigator */}
      <div className="test-sidebar">
        <div className="navigator-card glass">
          <h3 className="navigator-title">Questions Navigator</h3>
          <div className="navigator-grid">
            {questions.map((_, idx) => {
              const isAttempted = answers[idx] !== undefined;
              const isCurrent = currentIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIdx(idx)}
                  className={`nav-bubble ${isAttempted ? 'attempted' : ''} ${isCurrent ? 'current' : ''}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
          <div className="navigator-legend mt-6">
            <div className="legend-item">
              <div className="nav-bubble attempted mini"></div> Attempted
            </div>
            <div className="legend-item">
              <div className="nav-bubble mini"></div> Unanswered
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockTest;
