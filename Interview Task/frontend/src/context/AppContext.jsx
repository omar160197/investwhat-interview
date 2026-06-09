import { createContext, useContext, useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import * as articlesApi from '../api/articles.api.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentStep,    setCurrentStep]    = useState(0);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [articles,       setArticles]       = useState([]);
  const [summaryMap,     setSummaryMap]     = useState({});
  const [transitionDir,  setTransitionDir]  = useState('forward');
  const [transitioning,  setTransitioning]  = useState(false);

  const searchMutation = useMutation({
    mutationFn: (topicIds) => articlesApi.search(topicIds).then((r) => r.data.data),
    onSuccess:  (data)     => setArticles(data),
  });

  const goToStep = useCallback((step) => {
    if (step === currentStep) return;
    setTransitionDir(step > currentStep ? 'forward' : 'backward');
    setTransitioning(true);
    setTimeout(() => {
      setCurrentStep(step);
      setTransitioning(false);
    }, 200);
  }, [currentStep]);

  const handleTopicToggle = useCallback((id) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const handleSearchStart = useCallback((topics) => {
    searchMutation.reset();
    setArticles([]);
    searchMutation.mutate(topics);
    goToStep(1);
  }, [goToStep]);

  const handleStartOver = useCallback(() => {
    setSelectedTopics([]);
    setArticles([]);
    setSummaryMap({});
    searchMutation.reset();
    goToStep(0);
  }, [goToStep]);

  return (
    <AppContext.Provider value={{
      currentStep, goToStep,
      transitionDir, transitioning,
      selectedTopics, handleTopicToggle,
      articles, setArticles,
      summaryMap, setSummaryMap,
      searchMutation, handleSearchStart, handleStartOver,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
