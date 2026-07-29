import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ProgressContext = createContext(null);

export const ProgressProvider = ({ children }) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState({ scores: {}, mistakes: {} });

  useEffect(() => {
    if (user && user.email) {
      const storedProgress = localStorage.getItem(`progress_${user.email}`);
      if (storedProgress) {
        setProgress(JSON.parse(storedProgress));
      } else {
        setProgress({ scores: {}, mistakes: {} });
      }
    } else {
      setProgress({ scores: {}, mistakes: {} });
    }
  }, [user]);

  const saveProgressToStorage = (newProgress) => {
    if (user && user.email) {
      localStorage.setItem(`progress_${user.email}`, JSON.stringify(newProgress));
    }
  };

  const saveScore = (topicId, score) => {
    setProgress((prev) => {
      const newProgress = {
        ...prev,
        scores: {
          ...prev.scores,
          [topicId]: Math.max(score, prev.scores[topicId] || 0) // keep best score
        }
      };
      saveProgressToStorage(newProgress);
      return newProgress;
    });
  };

  const saveMistakes = (topicId, wrongQuestionIds) => {
    setProgress((prev) => {
      const existingMistakes = prev.mistakes[topicId] || [];
      // Combine and get unique mistakes
      const updatedMistakes = [...new Set([...existingMistakes, ...wrongQuestionIds])];
      
      const newProgress = {
        ...prev,
        mistakes: {
          ...prev.mistakes,
          [topicId]: updatedMistakes
        }
      };
      saveProgressToStorage(newProgress);
      return newProgress;
    });
  };

  const resolveMistakes = (topicId, correctedQuestionIds) => {
    setProgress((prev) => {
      const existingMistakes = prev.mistakes[topicId] || [];
      const updatedMistakes = existingMistakes.filter(id => !correctedQuestionIds.includes(id));
      
      const newProgress = {
        ...prev,
        mistakes: {
          ...prev.mistakes,
          [topicId]: updatedMistakes
        }
      };
      saveProgressToStorage(newProgress);
      return newProgress;
    });
  };

  return (
    <ProgressContext.Provider value={{ progress, saveScore, saveMistakes, resolveMistakes }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);
