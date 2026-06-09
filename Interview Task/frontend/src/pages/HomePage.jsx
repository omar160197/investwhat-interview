import { BarChart2, RefreshCw, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useTopics } from '../hooks/useTopics';
import StepProgress from '../components/ui/StepProgress';
import Step1Topics from '../components/Step1Topics';
import Step2Search from '../components/Step2Search';
import Step3Articles from '../components/Step3Articles';
import Step4Summary from '../components/Step4Summary';
import Step5Send from '../components/Step5Send';

export default function HomePage() {
  const { user, logout }  = useAuth();
  const { data: topicsData, isLoading: topicsLoading } = useTopics();

  const {
    currentStep, goToStep,
    transitionDir, transitioning,
    selectedTopics, handleTopicToggle,
    articles,
    searchMutation, handleSearchStart, handleStartOver,
  } = useApp();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--slate-50)' }}>
      {/* Header */}
      <header style={{
        background: '#fff',
        borderBottom: '1px solid var(--slate-200)',
        padding: 'var(--space-4) var(--space-6)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--blue-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart2 size={18} color="#fff" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--slate-900)' }}>
              Invest Interview
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            {currentStep > 0 && (
              <button
                onClick={handleStartOver}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--slate-500)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
              >
                <RefreshCw size={14} /> Start over
              </button>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--blue-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: 'var(--blue-600)', fontFamily: 'var(--font-mono)' }}>
                {user?.avatar}
              </div>
              <button
                onClick={logout}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-sm)', color: 'var(--slate-400)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stepper bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--slate-100)', padding: 'var(--space-4) var(--space-6)' }}>
        <StepProgress
          currentStep={currentStep}
          onStepClick={(step) => step < currentStep && goToStep(step)}
        />
      </div>

      {/* Main content */}
      <main style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: 'var(--space-8) var(--space-6)',
        opacity: transitioning ? 0 : 1,
        transform: transitioning ? `translateX(${transitionDir === 'forward' ? '20px' : '-20px'})` : 'translateX(0)',
        transition: 'all 0.2s var(--ease-out)',
      }}>
        {currentStep === 0 && (
          <Step1Topics
            topics={topicsData}
            isLoading={topicsLoading}
            selectedTopics={selectedTopics}
            onToggle={handleTopicToggle}
            onContinue={() => handleSearchStart(selectedTopics)}
          />
        )}
        {currentStep === 1 && (
          <Step2Search
            selectedTopics={selectedTopics}
            topics={topicsData}
            isSearching={searchMutation.isPending}
            articles={articles}
            searchError={searchMutation.error?.response?.data?.message}
            onComplete={() => goToStep(2)}
          />
        )}
        {currentStep === 2 && (
          <Step3Articles
            articles={articles}
            onContinue={() => goToStep(3)}
          />
        )}
        {currentStep === 3 && (
          <Step4Summary
            articles={articles}
            onStartOver={handleStartOver}
            onContinue={() => goToStep(4)}
          />
        )}
        {currentStep === 4 && (
          <Step5Send
            articles={articles}
            onStartOver={handleStartOver}
          />
        )}
      </main>
    </div>
  );
}
