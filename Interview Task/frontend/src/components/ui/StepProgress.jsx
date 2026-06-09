import { Check } from 'lucide-react';

const STEP_LABELS = ['Your topics', 'Web search', 'Articles', 'Summary', 'Send'];

export default function StepProgress({ currentStep, onStepClick }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 var(--space-4)',
      maxWidth: 720,
      margin: '0 auto',
    }}>
      {STEP_LABELS.map((label, i) => {
        const active = i === currentStep;
        const completed = i < currentStep;
        return (
          <div key={i} style={{ display: 'contents' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                cursor: completed ? 'pointer' : 'default',
              }}
              onClick={() => completed && onStepClick && onStepClick(i)}
            >
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                fontFamily: 'var(--font-body)',
                background: completed || active ? 'var(--blue-500)' : 'var(--slate-100)',
                color: (active || completed) ? '#fff' : 'var(--slate-400)',
                transition: 'all var(--duration-normal) var(--ease-out)',
                flexShrink: 0,
              }}>
                {completed ? <Check size={18} color="#fff" /> : (i + 1)}
              </div>
              <span
                className="step-label"
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: active ? 600 : 500,
                  color: (active || completed) ? 'var(--slate-900)' : 'var(--slate-400)',
                  whiteSpace: 'nowrap',
                  transition: 'color var(--duration-normal) var(--ease-out)',
                }}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div style={{
                flex: '1 1 40px',
                height: 2,
                minWidth: 24,
                maxWidth: 80,
                margin: '0 var(--space-2)',
                background: completed ? 'var(--blue-500)' : 'var(--slate-200)',
                borderRadius: 1,
                transition: 'background var(--duration-normal) var(--ease-out)',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
