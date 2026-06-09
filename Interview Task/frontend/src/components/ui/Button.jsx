import { useState } from 'react';

export default function Button({ children, variant = 'primary', size = 'md', disabled, onClick, style }) {
  const [hovered, setHovered] = useState(false);

  const sizes = {
    sm: { padding: '8px 16px', fontSize: 'var(--text-sm)' },
    md: { padding: '12px 24px', fontSize: 'var(--text-base)' },
    lg: { padding: '14px 32px', fontSize: 'var(--text-md)' },
  };

  const variants = {
    primary: {
      background: 'var(--blue-500)',
      color: '#fff',
      boxShadow: '0 1px 3px oklch(0.4 0.15 250 / 0.3)',
    },
    secondary: {
      background: 'var(--slate-100)',
      color: 'var(--slate-700)',
      boxShadow: 'none',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--slate-600)',
      boxShadow: 'none',
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        borderRadius: 'var(--radius-md)',
        transition: 'all var(--duration-fast) var(--ease-out)',
        opacity: disabled ? 0.5 : 1,
        transform: hovered && !disabled ? 'translateY(-1px)' : 'none',
        filter: hovered && !disabled && variant === 'primary' ? 'brightness(1.08)' : 'none',
        ...sizes[size],
        ...variants[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}
