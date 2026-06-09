import { useMemo, useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, Loader } from 'lucide-react';
import Button from './ui/Button';
import Chip from './ui/Chip';
import FadeIn from './ui/FadeIn';
import * as topicsApi from '../api/topics.api.js';

function StockChip({ item, selected, onToggle }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={() => onToggle(item._id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={item.reason}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        width: 88,
        height: 76,
        borderRadius: 'var(--radius-lg)',
        border: selected ? '2px solid var(--blue-500)' : '2px solid var(--slate-200)',
        background: selected ? 'var(--blue-50)' : hovered ? 'var(--slate-50)' : '#fff',
        cursor: 'pointer',
        transition: 'all var(--duration-fast) var(--ease-out)',
        fontFamily: 'var(--font-body)',
        transform: hovered ? 'translateY(-1px)' : 'none',
      }}
    >
      <span style={{
        fontSize: 'var(--text-sm)',
        fontWeight: 700,
        color: selected ? 'var(--blue-600)' : 'var(--slate-800)',
        fontFamily: 'var(--font-mono)',
      }}>
        {item.label}
      </span>
      <span style={{ fontSize: '11px', color: 'var(--slate-400)', fontWeight: 500 }}>
        {item.subtitle}
      </span>
    </button>
  );
}

const sectionTitle = {
  fontFamily: 'var(--font-display)',
  fontSize: 'var(--text-sm)',
  fontWeight: 600,
  color: 'var(--slate-400)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: 'var(--space-4)',
};

export default function Step1Topics({ topics, isLoading, selectedTopics, onToggle, onContinue }) {
  const count = selectedTopics.length;

  // AI-driven stock suggestions keyed on selected sector IDs
  const [aiStocks,      setAiStocks]      = useState([]);
  const [aiLoading,     setAiLoading]     = useState(false);
  const [aiRateLimited, setAiRateLimited] = useState(false);
  const debounceRef = useRef(null);
  const prevKeyRef  = useRef('');

  useEffect(() => {
    const sectorIds = selectedTopics.filter((id) =>
      topics?.sectors.some((s) => s._id === id)
    );
    const key = [...sectorIds].sort().join(',');
    if (key === prevKeyRef.current) return;
    prevKeyRef.current = key;

    if (!sectorIds.length) {
      setAiStocks([]);
      setAiRateLimited(false);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setAiLoading(true);
      setAiRateLimited(false);
      try {
        const { data } = await topicsApi.suggestStocks(sectorIds);
        setAiStocks(data.data || []);
      } catch (err) {
        setAiStocks([]);
        if (err?.response?.status === 429) setAiRateLimited(true);
      } finally {
        setAiLoading(false);
      }
    }, 800);

    return () => clearTimeout(debounceRef.current);
  }, [selectedTopics, topics]);

  const relatedThemeItems = useMemo(() => {
    if (!topics) return [];
    const slugSet = new Set();
    selectedTopics.forEach((id) => {
      const stock = topics.stocks.find((s) => s._id === id);
      if (stock) stock.relatedThemes.forEach((slug) => slugSet.add(slug));
    });
    return topics.themes.filter((t) => slugSet.has(t.slug));
  }, [selectedTopics, topics]);

  const hasSectorSelected = topics?.sectors.some((s) => selectedTopics.includes(s._id));
  const hasStockSelected  = topics?.stocks.some((s) => selectedTopics.includes(s._id));

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-16)', color: 'var(--slate-400)', fontFamily: 'var(--font-body)' }}>
        Loading topics...
      </div>
    );
  }

  return (
    <div>
      <FadeIn>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-3xl)',
            fontWeight: 700,
            color: 'var(--slate-900)',
            marginBottom: 'var(--space-3)',
          }}>
            What are you interested in?
          </h1>
          <p style={{
            fontSize: 'var(--text-md)',
            color: 'var(--slate-500)',
            maxWidth: 480,
            margin: '0 auto',
            lineHeight: 'var(--leading-relaxed)',
          }}>
            Pick the topics you'd like to follow. We'll find and simplify the latest news for you.
          </p>
        </div>
      </FadeIn>

      {/* Sectors */}
      <FadeIn delay={100}>
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <div style={sectionTitle}>Sectors</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            {topics?.sectors.map((t) => (
              <Chip
                key={t._id}
                label={t.label}
                icon={t.icon}
                selected={selectedTopics.includes(t._id)}
                onClick={() => onToggle(t._id)}
              />
            ))}
          </div>
          {!hasSectorSelected && (
            <div style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--slate-400)', fontStyle: 'italic' }}>
              Select a sector to see related stocks
            </div>
          )}
        </div>
      </FadeIn>

      {/* Stocks — populated dynamically by AI based on selected sectors */}
      {hasSectorSelected && (
        <FadeIn delay={0}>
          <div style={{ marginBottom: 'var(--space-8)', animation: 'fade-slide-in 0.3s var(--ease-out)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
              <span style={sectionTitle}>Stocks</span>
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: '11px',
                color: 'var(--blue-500)',
                background: 'var(--blue-50)',
                border: '1px solid #bfdbfe',
                padding: '1px 8px',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 600,
              }}>
                <Sparkles size={10} />
                AI Picks
              </span>
            </div>

            {aiLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--slate-400)', fontSize: 'var(--text-sm)', padding: 'var(--space-2) 0' }}>
                <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
                Finding relevant stocks...
              </div>
            ) : aiRateLimited ? (
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-500)', fontStyle: 'italic' }}>
                ⏳ AI suggestions unavailable right now — free tier quota exhausted.
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                  {aiStocks.map((stock) => (
                    <StockChip
                      key={stock._id}
                      item={stock}
                      selected={selectedTopics.includes(stock._id)}
                      onToggle={onToggle}
                    />
                  ))}
                </div>
                {!hasStockSelected && aiStocks.length > 0 && (
                  <div style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--slate-400)', fontStyle: 'italic' }}>
                    Select a stock to see related themes
                  </div>
                )}
              </>
            )}
          </div>
        </FadeIn>
      )}

      {/* Themes */}
      {hasStockSelected && relatedThemeItems.length > 0 && (
        <FadeIn key={relatedThemeItems.map((t) => t._id).join(',')} delay={0}>
          <div style={{ marginBottom: 'var(--space-8)', animation: 'fade-slide-in 0.3s var(--ease-out)' }}>
            <div style={sectionTitle}>Themes</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
              {relatedThemeItems.map((t) => (
                <Chip
                  key={t._id}
                  label={t.label}
                  icon={t.icon}
                  selected={selectedTopics.includes(t._id)}
                  onClick={() => onToggle(t._id)}
                />
              ))}
            </div>
          </div>
        </FadeIn>
      )}

      {/* Footer */}
      <FadeIn delay={400}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'var(--space-8)',
          paddingTop: 'var(--space-6)',
          borderTop: '1px solid var(--slate-200)',
        }}>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-400)' }}>
            {count === 0 ? 'Select at least 1 topic' : `${count} topic${count > 1 ? 's' : ''} selected`}
          </span>
          <Button onClick={onContinue} disabled={count === 0}>
            Search news <ArrowRight size={18} color="#fff" />
          </Button>
        </div>
      </FadeIn>
    </div>
  );
}
