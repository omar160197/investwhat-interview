import { useState, useEffect } from 'react';

export default function FadeIn({ children, delay = 0, style }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'all var(--duration-slow) var(--ease-out)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
