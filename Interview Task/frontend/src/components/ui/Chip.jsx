import { useState } from 'react';
import { Check } from 'lucide-react';
import LucideIcon from './LucideIcon';

export default function Chip({ label, icon, selected, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        padding: '10px 18px',
        borderRadius: 'var(--radius-pill)',
        border: selected ? '2px solid var(--blue-500)' : '2px solid var(--slate-200)',
        background: selected ? 'var(--blue-50)' : hovered ? 'var(--slate-50)' : '#fff',
        color: selected ? 'var(--blue-700)' : 'var(--slate-700)',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-sm)',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all var(--duration-fast) var(--ease-out)',
        transform: hovered ? 'translateY(-1px)' : 'none',
      }}
    >
      {icon && <LucideIcon name={icon} size={16} />}
      {label}
      {selected && <Check size={14} color="var(--blue-500)" />}
    </button>
  );
}
