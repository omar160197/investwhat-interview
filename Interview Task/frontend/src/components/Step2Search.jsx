import { useState, useEffect } from 'react';
import { Search, Check, FileText, AlertCircle } from 'lucide-react';
import FadeIn from './ui/FadeIn';

export default function Step2Search({ selectedTopics, topics, isSearching, articles, searchError, onComplete }) {
  const [revealedCount, setRevealedCount] = useState(0);
  const [done, setDone] = useState(false);

  // Resolve topic labels from IDs
  const topicLabels = (() => {
    if (!topics) return selectedTopics;
    const all = [...topics.sectors, ...topics.stocks, ...topics.themes];
    return selectedTopics.map((id) => {
      const t = all.find((x) => x._id === id);
      return t ? (t.subtitle || t.label) : id;
    });
  })();

  const VISIBLE_MAX = 6;
  const interval_ms = articles.length > 20 ? 80 : articles.length > 10 ? 150 : 350;

  // Once search finishes and articles arrive, reveal them then advance
  useEffect(() => {
    if (isSearching || !articles.length || done) return;

    let count = 0;
    const interval = setInterval(() => {
      count++;
      setRevealedCount(count);
      if (count >= articles.length) {
        clearInterval(interval);
        setTimeout(() => {
          setDone(true);
          setTimeout(onComplete, 600);
        }, 400);
      }
    }, interval_ms);

    return () => clearInterval(interval);
  }, [isSearching, articles.length]);

  if (searchError) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, textAlign: 'center' }}>
        <FadeIn>
          <div style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: '#fef2f2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-5)',
          }}>
            <AlertCircle size={28} color="#dc2626" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--slate-900)', marginBottom: 'var(--space-2)' }}>
            Search failed
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-500)' }}>{searchError}</p>
        </FadeIn>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, textAlign: 'center' }}>
      <FadeIn>
        {/* Pulsing icon */}
        <div style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'var(--blue-50)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto var(--space-6)',
          animation: done ? 'none' : 'pulse-ring 2s ease-in-out infinite',
        }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: 'var(--blue-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {done
              ? <Check size={24} color="var(--success)" />
              : <Search size={24} color="var(--blue-500)" />
            }
          </div>
        </div>

        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-2xl)',
          fontWeight: 700,
          color: 'var(--slate-900)',
          marginBottom: 'var(--space-2)',
        }}>
          {isSearching && 'Searching BBC News...'}
          {!isSearching && !done && articles.length > 0 && `Found ${articles.length} articles`}
          {done && `Found ${articles.length} articles`}
        </h2>

        <p style={{ fontSize: 'var(--text-base)', color: 'var(--slate-500)', marginBottom: 'var(--space-8)' }}>
          {isSearching && (
            <span>
              Looking for <strong style={{ color: 'var(--blue-600)' }}>
                {topicLabels.join(', ')}
              </strong> news...
            </span>
          )}
          {!isSearching && articles.length > 0 && !done && 'Importing articles into your feed...'}
          {done && 'Ready to read and summarize'}
        </p>

        {/* Indeterminate progress bar while searching */}
        <div style={{
          width: '100%',
          maxWidth: 420,
          margin: '0 auto var(--space-8)',
          height: 6,
          borderRadius: 3,
          background: 'var(--slate-100)',
          overflow: 'hidden',
        }}>
          {isSearching ? (
            <div style={{
              height: '100%',
              borderRadius: 3,
              background: 'var(--blue-500)',
              width: '40%',
              animation: 'shimmer 1.4s ease-in-out infinite',
            }} />
          ) : (
            <div style={{
              height: '100%',
              borderRadius: 3,
              background: done ? 'var(--success)' : 'var(--blue-500)',
              width: done ? '100%' : `${Math.round((revealedCount / articles.length) * 100)}%`,
              transition: 'all 0.4s var(--ease-out)',
            }} />
          )}
        </div>

        {/* Revealed articles */}
        {revealedCount > 0 && (
          <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'left' }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)',
              maxHeight: 260,
              overflowY: 'auto',
              paddingRight: 4,
            }}>
              {articles.slice(Math.max(0, revealedCount - VISIBLE_MAX), revealedCount).map((article) => (
                <div key={article._id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'var(--slate-50)',
                  borderRadius: 'var(--radius-md)',
                  animation: 'fade-slide-in 0.3s var(--ease-out)',
                  flexShrink: 0,
                }}>
                  <FileText size={16} color="var(--blue-500)" style={{ flexShrink: 0 }} />
                  <span style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--slate-700)',
                    fontWeight: 500,
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {article.title}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--slate-400)', flexShrink: 0 }}>
                    {article.source}
                  </span>
                </div>
              ))}
            </div>
            {revealedCount > VISIBLE_MAX && (
              <div style={{
                marginTop: 'var(--space-2)',
                fontSize: '12px',
                color: 'var(--slate-400)',
                textAlign: 'center',
              }}>
                +{revealedCount - VISIBLE_MAX} more article{revealedCount - VISIBLE_MAX > 1 ? 's' : ''} loaded
              </div>
            )}
          </div>
        )}
      </FadeIn>
    </div>
  );
}
