import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Sparkles, BookOpen, Loader, Send, RefreshCw, Eye, Check, CheckSquare, Square } from 'lucide-react';
import Button from './ui/Button';
import FadeIn from './ui/FadeIn';
import { useApp } from '../context/AppContext';
import * as summariesApi from '../api/summaries.api.js';

const PREVIEW_COUNT = 6;

// ── Selection card ────────────────────────────────────────────────
function ArticleSelectCard({ article, selected, onToggle }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onToggle}
      style={{
        background: selected ? 'var(--blue-50)' : '#fff',
        border: `2px solid ${selected ? 'var(--blue-400)' : hovered ? 'var(--slate-300)' : 'var(--slate-200)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)',
        cursor: 'pointer',
        transition: 'all var(--duration-fast) var(--ease-out)',
        display: 'flex',
        gap: 'var(--space-3)',
        alignItems: 'flex-start',
        userSelect: 'none',
      }}
    >
      {/* Checkbox */}
      <div style={{ flexShrink: 0, marginTop: 2 }}>
        {selected
          ? <CheckSquare size={18} color="var(--blue-500)" />
          : <Square size={18} color="var(--slate-300)" />
        }
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '10px', fontWeight: 700, color: 'var(--blue-600)',
            background: 'var(--blue-100)', padding: '1px 7px', borderRadius: 'var(--radius-pill)',
            letterSpacing: '0.04em', textTransform: 'uppercase',
          }}>
            {article.source}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--slate-400)' }}>{article.date}</span>
        </div>
        <p style={{
          fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', fontWeight: 600,
          color: selected ? 'var(--slate-800)' : 'var(--slate-700)',
          lineHeight: 'var(--leading-tight)',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          margin: 0,
        }}>
          {article.title}
        </p>
      </div>
    </div>
  );
}

// ── Summary preview card (results phase) ─────────────────────────
function SummaryPreviewCard({ article, summaryData }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const keyPoints = summaryData?.keyPoints?.slice(0, 2) || [];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/summaries/${article._id}`)}
      style={{
        background: '#fff',
        border: `1px solid ${hovered ? 'var(--blue-200)' : 'var(--slate-200)'}`,
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all var(--duration-normal) var(--ease-out)',
        boxShadow: hovered ? '0 4px 16px oklch(0.55 0.15 250 / 0.12)' : 'none',
        transform: hovered ? 'translateY(-3px)' : 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Gradient accent */}
      <div style={{ height: 4, background: 'linear-gradient(90deg, var(--blue-400), var(--blue-600))', flexShrink: 0 }} />

      <div style={{ padding: 'var(--space-5)', flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '10px', fontWeight: 700, color: 'var(--blue-600)',
            background: 'var(--blue-50)', padding: '2px 8px', borderRadius: 'var(--radius-pill)',
            letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>
            {article.source}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--slate-400)' }}>{article.date}</span>
          {summaryData && (
            <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 3 }}>
              <Sparkles size={11} color="var(--blue-400)" />
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--blue-500)', letterSpacing: '0.04em' }}>AI</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 700,
          color: 'var(--slate-900)', lineHeight: 'var(--leading-tight)',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          margin: 0,
        }}>
          {article.title}
        </h3>

        {/* Summary text */}
        {summaryData ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <p style={{
              fontSize: 'var(--text-sm)', color: 'var(--slate-600)', lineHeight: 1.6,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              margin: 0,
            }}>
              {summaryData.summary}
            </p>

            {/* Key points */}
            {keyPoints.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                {keyPoints.map((pt, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                    <div style={{
                      width: 16, height: 16, borderRadius: '50%', background: 'var(--blue-100)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
                    }}>
                      <Check size={9} color="var(--blue-600)" strokeWidth={3} />
                    </div>
                    <span style={{
                      fontSize: '12px', color: 'var(--slate-500)', lineHeight: 1.45,
                      display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      {pt}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{ flex: 1, padding: 'var(--space-3)', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-400)' }}>Summary not available</span>
          </div>
        )}

        {/* Footer */}
        <div style={{ paddingTop: 'var(--space-3)', borderTop: '1px solid var(--slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12px', color: 'var(--slate-400)' }}>
            {summaryData?.keyPoints?.length ? `${summaryData.keyPoints.length} key points` : ''}
          </span>
          <span style={{
            fontSize: '12px', fontWeight: 600,
            color: hovered ? 'var(--blue-700)' : 'var(--blue-500)',
            display: 'flex', alignItems: 'center', gap: 4,
            transition: 'color var(--duration-fast)',
          }}>
            <Eye size={13} /> Read more
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────
export default function Step4Summary({ articles, onStartOver, onContinue }) {
  const navigate = useNavigate();
  const { summaryMap, setSummaryMap } = useApp();

  const alreadyDone = Object.keys(summaryMap).length > 0;
  const [isSelecting, setIsSelecting] = useState(!alreadyDone);
  const [selectedIds, setSelectedIds] = useState(() => new Set(articles.map((a) => a._id)));

  const bulkMutation = useMutation({
    mutationFn: (ids) => summariesApi.bulkSummarize(ids).then((r) => r.data.data),
    onSuccess: (results) => {
      const map = {};
      results.forEach((r) => { if (r.status === 'success') map[r.id] = r.data; });
      setSummaryMap(map);
    },
  });

  const toggle = (id) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleSummarize = () => {
    const ids = [...selectedIds];
    if (!ids.length) return;
    setSummaryMap({});
    bulkMutation.reset();
    setIsSelecting(false);
    bulkMutation.mutate(ids);
  };

  // ── Loading ──────────────────────────────────────────────────
  if (!isSelecting && bulkMutation.isPending) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, textAlign: 'center' }}>
        <FadeIn>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', background: 'var(--blue-50)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto var(--space-6)', animation: 'pulse-ring 2s ease-in-out infinite',
          }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--blue-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={24} color="var(--blue-500)" />
            </div>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--slate-900)', marginBottom: 'var(--space-2)' }}>
            Generating summaries
          </h2>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--slate-500)', marginBottom: 'var(--space-6)' }}>
            Using AI to simplify {selectedIds.size} article{selectedIds.size !== 1 ? 's' : ''}...
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', justifyContent: 'center', color: 'var(--slate-400)', fontSize: 'var(--text-sm)' }}>
            <Loader size={14} color="var(--blue-400)" style={{ animation: 'spin 1s linear infinite' }} />
            This may take a moment
          </div>
        </FadeIn>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────
  if (!isSelecting && bulkMutation.isError) {
    const err = bulkMutation.error;
    const is429 = err?.response?.status === 429;
    const retryAfter = err?.response?.data?.retryAfter || 60;
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
        {is429 ? (
          <>
            <div style={{ fontSize: 32, marginBottom: 'var(--space-3)' }}>⏳</div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--slate-800)', marginBottom: 'var(--space-2)' }}>
              AI rate limit reached
            </p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-500)', marginBottom: 'var(--space-5)' }}>
              Free tier quota exhausted. Please wait {retryAfter} seconds and try again.
            </p>
          </>
        ) : (
          <p style={{ color: '#dc2626', marginBottom: 'var(--space-4)' }}>Failed to generate summaries</p>
        )}
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
          <Button variant="secondary" onClick={() => setIsSelecting(true)}>Change selection</Button>
          <Button variant="secondary" onClick={() => bulkMutation.mutate([...selectedIds])}>
            <RefreshCw size={15} /> Retry
          </Button>
        </div>
      </div>
    );
  }

  // ── All rate-limited (HTTP 200 but no successes) ─────────────
  const successCount = Object.keys(summaryMap).length;
  if (!isSelecting && bulkMutation.isSuccess && successCount === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
        <div style={{ fontSize: 32, marginBottom: 'var(--space-3)' }}>⏳</div>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--slate-800)', marginBottom: 'var(--space-2)' }}>
          AI rate limit reached
        </p>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-500)', marginBottom: 'var(--space-5)' }}>
          The AI quota is exhausted. Please wait a minute and try again.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
          <Button variant="secondary" onClick={() => setIsSelecting(true)}>Change selection</Button>
          <Button variant="secondary" onClick={() => bulkMutation.mutate([...selectedIds])}>
            <RefreshCw size={15} /> Retry
          </Button>
        </div>
      </div>
    );
  }

  // ── Results ──────────────────────────────────────────────────
  if (!isSelecting && (bulkMutation.isSuccess || alreadyDone)) {
    const summarizedArticles = articles.filter((a) => summaryMap[a._id]);
    const preview   = summarizedArticles.slice(0, PREVIEW_COUNT);
    const remaining = summarizedArticles.length - PREVIEW_COUNT;

    return (
      <div>
        <FadeIn>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-6)', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--slate-900)', marginBottom: 'var(--space-1)' }}>
                Your news, simplified
              </h2>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-500)' }}>
                {summarizedArticles.length} article{summarizedArticles.length !== 1 ? 's' : ''} simplified — showing {preview.length}
              </p>
            </div>
            <button
              onClick={() => { setSummaryMap({}); setIsSelecting(true); bulkMutation.reset(); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                background: 'none', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)',
                padding: '6px 12px', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 500,
                color: 'var(--slate-500)', transition: 'all var(--duration-fast)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--blue-300)'; e.currentTarget.style.color = 'var(--blue-600)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--slate-200)'; e.currentTarget.style.color = 'var(--slate-500)'; }}
            >
              <RefreshCw size={13} /> Re-select articles
            </button>
          </div>
        </FadeIn>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
          {preview.map((article) => (
            <FadeIn key={article._id} delay={0}>
              <SummaryPreviewCard article={article} summaryData={summaryMap[article._id]} />
            </FadeIn>
          ))}
        </div>

        {remaining > 0 && (
          <FadeIn delay={80}>
            <button
              onClick={() => navigate('/summaries')}
              style={{
                width: '100%', padding: 'var(--space-4)', background: '#fff',
                border: '1.5px dashed var(--slate-300)', borderRadius: 'var(--radius-lg)',
                cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
                fontWeight: 600, color: 'var(--slate-500)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)',
                marginBottom: 'var(--space-6)', transition: 'all var(--duration-fast)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--blue-400)'; e.currentTarget.style.color = 'var(--blue-600)'; e.currentTarget.style.background = 'var(--blue-50)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--slate-300)'; e.currentTarget.style.color = 'var(--slate-500)'; e.currentTarget.style.background = '#fff'; }}
            >
              <BookOpen size={16} />
              View all {summarizedArticles.length} simplified articles
            </button>
          </FadeIn>
        )}

        <FadeIn delay={120}>
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--slate-200)' }}>
            <Button onClick={onContinue} size="lg">
              <Send size={16} color="#fff" /> Send to users
            </Button>
          </div>
        </FadeIn>
      </div>
    );
  }

  // ── Selection view ───────────────────────────────────────────
  const allSelected = selectedIds.size === articles.length;

  return (
    <div>
      <FadeIn>
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--slate-900)', marginBottom: 'var(--space-1)' }}>
            Choose articles to simplify
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-500)' }}>
            Select the articles you want the AI to rewrite in plain language.
          </p>
        </div>
      </FadeIn>

      {/* Controls row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 28, height: 28, borderRadius: '50%',
            background: selectedIds.size > 0 ? 'var(--blue-100)' : 'var(--slate-100)',
          }}>
            <Check size={14} color={selectedIds.size > 0 ? 'var(--blue-600)' : 'var(--slate-400)'} />
          </div>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-600)', fontWeight: 500 }}>
            {selectedIds.size} of {articles.length} selected
          </span>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button
            onClick={() => setSelectedIds(new Set(articles.map((a) => a._id)))}
            style={{
              background: 'none', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)',
              padding: '5px 11px', cursor: 'pointer', fontFamily: 'var(--font-body)',
              fontSize: '12px', fontWeight: 600, color: 'var(--slate-600)',
              transition: 'all var(--duration-fast)',
            }}
          >
            Select all
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            style={{
              background: 'none', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)',
              padding: '5px 11px', cursor: 'pointer', fontFamily: 'var(--font-body)',
              fontSize: '12px', fontWeight: 600, color: 'var(--slate-600)',
              transition: 'all var(--duration-fast)',
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Article grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        {articles.map((article) => (
          <FadeIn key={article._id} delay={0}>
            <ArticleSelectCard
              article={article}
              selected={selectedIds.has(article._id)}
              onToggle={() => toggle(article._id)}
            />
          </FadeIn>
        ))}
      </div>

      {/* Action row */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--slate-200)' }}>
        <Button
          onClick={handleSummarize}
          size="lg"
          disabled={selectedIds.size === 0}
        >
          <Sparkles size={18} color="#fff" />
          Simplify {selectedIds.size > 0 ? `${selectedIds.size} article${selectedIds.size !== 1 ? 's' : ''}` : 'articles'}
        </Button>
      </div>
    </div>
  );
}
