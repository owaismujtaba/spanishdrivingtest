import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, RotateCcw, ArrowLeft } from 'lucide-react';
import questionsData from '../data/questions.json';
import topicsData from '../data/topics.json';
import { useProgress } from '../context/ProgressContext';
import './Practice.css';

const Practice = () => {
  const { topicId } = useParams();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode'); // 'mistakes' or null
  const navigate = useNavigate();
  
  const { progress, saveScore, saveMistakes, resolveMistakes } = useProgress();
  
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  
  const topic = topicsData.find(t => t.id === topicId);

  useEffect(() => {
    if (!topic) return;

    let filteredQuestions = questionsData.filter(q => q.topic === topicId);
    
    if (mode === 'mistakes') {
      const mistakeIds = progress.mistakes[topicId] || [];
      filteredQuestions = filteredQuestions.filter(q => mistakeIds.includes(q.id));
    } else {
      // Standard practice: shuffle and pick 20
      filteredQuestions = filteredQuestions.sort(() => 0.5 - Math.random()).slice(0, 20);
    }
    
    setQuestions(filteredQuestions);
  }, [topicId, mode, topic, progress.mistakes]);

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
      finishPractice();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const finishPractice = () => {
    setIsFinished(true);
    
    // Calculate mistakes and correct answers
    const wrongQuestionIds = [];
    const correctQuestionIds = [];
    
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        correctQuestionIds.push(q.id);
      } else {
        wrongQuestionIds.push(q.id);
      }
    });

    const score = Math.round(((questions.length - wrongQuestionIds.length) / questions.length) * 100);
    
    if (mode !== 'mistakes') {
      saveScore(topicId, score);
      if (wrongQuestionIds.length > 0) {
        saveMistakes(topicId, wrongQuestionIds);
      }
    } else {
      // If we are reviewing mistakes, we remove the ones we got right
      if (correctQuestionIds.length > 0) {
        resolveMistakes(topicId, correctQuestionIds);
      }
      // If we made new mistakes (or repeated them), we ensure they stay, but saveMistakes already handles uniqueness
      if (wrongQuestionIds.length > 0) {
        saveMistakes(topicId, wrongQuestionIds);
      }
    }
  };

  if (!topic) return <div className="container mt-8 text-center text-xl">Topic not found.</div>;
  if (questions.length === 0) {
    return (
      <div className="container mt-8 text-center">
        <h2 className="text-2xl font-bold mb-4">No questions available</h2>
        <p className="text-muted mb-6">
          {mode === 'mistakes' ? "Great job! You have no recorded mistakes for this topic." : "There are no questions for this topic yet."}
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/topics')}>
          <ArrowLeft size={18} /> Back to Topics
        </button>
      </div>
    );
  }

  if (isFinished) {
    let errors = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] !== q.correctAnswer) {
        errors++;
      }
    });
    const score = Math.round(((questions.length - errors) / questions.length) * 100);
    const passed = score >= 90; // Just an arbitrary passing threshold for practice

    return (
      <div className="container practice-results animate-fade-in">
        <div className={`result-card glass ${passed ? 'passed' : 'failed'}`}>
          {passed ? (
            <CheckCircle className="result-icon success" size={64} />
          ) : (
            <XCircle className="result-icon danger" size={64} />
          )}
          <h1 className="text-4xl font-bold mt-4">{mode === 'mistakes' ? 'Review Complete!' : 'Practice Complete!'}</h1>
          <p className="text-xl mt-2 mb-6">Your Score: {score}%</p>
          
          <div className="result-details">
            <p className="mb-2"><strong>Topic:</strong> {topic.title}</p>
            <p className="mb-2"><strong>Total Questions:</strong> {questions.length}</p>
            <p className="mb-4"><strong>Mistakes Made:</strong> {errors}</p>
          </div>

          <div className="result-actions">
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              <RotateCcw size={18} /> {mode === 'mistakes' ? 'Review Mistakes Again' : 'Practice Again'}
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/topics')}>
              Back to Topics
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  const selectedAnswer = answers[currentIdx];

  return (
    <div className="container practice-layout animate-fade-in">
      <div className="practice-header glass-panel">
        <div className="practice-title">
          <button className="btn-icon" onClick={() => navigate('/topics')} title="Back to Topics">
            <ArrowLeft size={20} />
          </button>
          <span className="font-semibold text-lg">{topic.title} {mode === 'mistakes' ? '(Mistakes Review)' : ''}</span>
        </div>
        <div className="practice-progress">
          {currentIdx + 1} / {questions.length}
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
            <img src={`${import.meta.env.BASE_URL}${currentQ.imageUrl.replace(/^\\//, '')}`} alt="Traffic Scene" className="question-image animate-fade-in" />
          </div>
        )}
        <h2 className="text-2xl font-semibold mb-6">{currentQ.question}</h2>
        <div className="options-list">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrect = currentQ.correctAnswer === idx;
            const showFeedback = selectedAnswer !== undefined;
            
            let btnClass = 'option-btn';
            if (showFeedback) {
              if (isCorrect) btnClass += ' correct';
              else if (isSelected) btnClass += ' incorrect';
              else btnClass += ' disabled';
            } else if (isSelected) {
              btnClass += ' selected';
            }

            return (
              <button
                key={idx}
                className={btnClass}
                onClick={() => !showFeedback && handleSelectAnswer(idx)}
                disabled={showFeedback}
              >
                <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                <span className="option-text">{option}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="practice-footer mt-8">
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
          disabled={selectedAnswer === undefined}
        >
          {currentIdx === questions.length - 1 ? 'Finish Practice' : 'Next Question'}
        </button>
      </div>
    </div>
  );
};

export default Practice;
