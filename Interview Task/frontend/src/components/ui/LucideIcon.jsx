import * as Icons from 'lucide-react';

export default function LucideIcon({ name, size = 20, color = 'currentColor', strokeWidth = 1.8, style }) {
  const Icon = Icons[name];
  if (!Icon) return null;
  return <Icon size={size} color={color} strokeWidth={strokeWidth} style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'middle', ...style }} />;
}
