import { useState } from 'react';
import { Clock, Eye, ExternalLink } from 'lucide-react';

export const SOURCE_COLORS = {
  'BBC News': { bg: '#fef3c7', text: '#92400e' },
};
export const defaultSourceColor = { bg: 'var(--blue-50)', text: 'var(--blue-700)' };

export function ArticleGridCard({ article, onView }) {
  const [hovered, setHovered] = useState(false);
  const color = SOURCE_COLORS[article.source] || defaultSourceColor;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onView(article)}
      style={{
        background: '#fff',
        border: '1px solid var(--slate-200)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all var(--duration-normal) var(--ease-out)',
        boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.08)' : 'none',
        transform: hovered ? 'translateY(-3px)' : 'none',
        cursor: 'pointer',
        height: '100%',
      }}
    >
      <div style={{ height: 3, background: hovered ? 'var(--blue-500)' : 'var(--slate-100)', transition: 'background var(--duration-normal)' }} />

      <div style={{ flex: 1, padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: color.text, background: color.bg, padding: '1px 7px', borderRadius: 'var(--radius-pill)' }}>
            {article.source}
          </span>
          <span style={{ fontSize: '10px', color: 'var(--slate-400)' }}>{article.date}</span>
          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 2, fontSize: '10px', color: 'var(--slate-400)' }}>
            <Clock size={10} /> {article.readTime}
          </span>
        </div>

        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-sm)',
          fontWeight: 700,
          color: 'var(--slate-900)',
          lineHeight: 'var(--leading-tight)',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1,
        }}>
          {article.title}
        </h3>

        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {article.topics?.slice(0, 2).map((t) => (
            <span key={t} style={{ fontSize: '9px', fontWeight: 600, color: 'var(--slate-500)', background: 'var(--slate-100)', padding: '1px 6px', borderRadius: 'var(--radius-pill)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      <div style={{
        padding: 'var(--space-3) var(--space-4)',
        borderTop: '1px solid var(--slate-100)',
        background: hovered ? 'var(--blue-50)' : '#fafafa',
        display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
        transition: 'background var(--duration-normal)',
      }}>
        <Eye size={13} color={hovered ? 'var(--blue-500)' : 'var(--slate-400)'} style={{ transition: 'color var(--duration-normal)' }} />
        <span style={{ fontSize: '12px', fontWeight: 600, color: hovered ? 'var(--blue-600)' : 'var(--slate-500)', transition: 'color var(--duration-normal)' }}>
          Read article
        </span>
      </div>
    </div>
  );
}

export function ArticleListCard({ article, index, onView }) {
  const [hovered, setHovered] = useState(false);
  const color = SOURCE_COLORS[article.source] || defaultSourceColor;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff', border: '1px solid var(--slate-200)',
        borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        display: 'flex', transition: 'all var(--duration-normal) var(--ease-out)',
        boxShadow: hovered ? 'var(--shadow-sm)' : 'none',
        transform: hovered ? 'translateY(-1px)' : 'none',
      }}
    >
      <div style={{
        width: 44, flexShrink: 0,
        background: hovered ? 'var(--blue-500)' : 'var(--slate-50)',
        borderRight: '1px solid var(--slate-100)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background var(--duration-normal)',
      }}>
        <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: hovered ? '#fff' : 'var(--slate-300)', transition: 'color var(--duration-normal)' }}>
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div style={{ flex: 1, padding: 'var(--space-4) var(--space-5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: color.text, background: color.bg, padding: '2px 8px', borderRadius: 'var(--radius-pill)' }}>
            {article.source}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--slate-400)' }}>{article.date}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '11px', color: 'var(--slate-400)' }}>
            <Clock size={11} /> {article.readTime}
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
            {article.topics?.slice(0, 3).map((t) => (
              <span key={t} style={{ fontSize: '9px', fontWeight: 600, color: 'var(--slate-500)', background: 'var(--slate-100)', padding: '1px 6px', borderRadius: 'var(--radius-pill)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {t}
              </span>
            ))}
          </div>
        </div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--slate-900)', lineHeight: 'var(--leading-tight)', marginBottom: 'var(--space-2)' }}>
          {article.title}
        </h3>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-500)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-3)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {article.preview}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <button onClick={() => onView(article)} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--blue-600)', padding: 0 }}>
            <Eye size={14} color="var(--blue-600)" /> Read article
          </button>
          <a href={article.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--slate-400)', textDecoration: 'none' }}>
            <ExternalLink size={13} /> Source
          </a>
        </div>
      </div>
    </div>
  );
}
