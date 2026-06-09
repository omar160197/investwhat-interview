import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart2, Sparkles, FileText, ChevronDown, Check, ExternalLink, TrendingUp, TrendingDown, Minus, AlertTriangle, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import * as articlesApi from '../api/articles.api.js';
import * as summariesApi from '../api/summaries.api.js';

const ACTION_STYLES = {
  BUY:   { bg: '#f0fdf4', border: '#86efac', color: '#15803d', Icon: TrendingUp  },
  SELL:  { bg: '#fef2f2', border: '#fca5a5', color: '#dc2626', Icon: TrendingDown },
  HOLD:  { bg: '#fffbeb', border: '#fcd34d', color: '#b45309', Icon: Minus        },
  WATCH: { bg: '#eff6ff', border: '#93c5fd', color: '#1d4ed8', Icon: TrendingUp   },
};
const RISK_STYLES = {
  LOW:    { bg: '#f0fdf4', color: '#15803d' },
  MEDIUM: { bg: '#fffbeb', color: '#b45309' },
  HIGH:   { bg: '#fef2f2', color: '#dc2626' },
};

function ActionBadge({ action, size = 'md' }) {
  const s = ACTION_STYLES[action] || ACTION_STYLES.WATCH;
  const pad = size === 'sm' ? '2px 8px' : '4px 14px';
  const fs  = size === 'sm' ? '11px' : '13px';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: 'var(--radius-pill)',
      padding: pad, fontSize: fs, fontWeight: 700, color: s.color, letterSpacing: '0.04em',
    }}>
      <s.Icon size={size === 'sm' ? 11 : 14} strokeWidth={2.5} /> {action}
    </span>
  );
}

function TradeAdvicePanel({ advice }) {
  const rs = RISK_STYLES[advice.risk] || RISK_STYLES.MEDIUM;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* Disclaimer */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)', padding: 'var(--space-3) var(--space-4)', background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 'var(--radius-md)' }}>
        <AlertTriangle size={14} color="#b45309" style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontSize: '12px', color: '#92400e', lineHeight: 1.4 }}>
          AI-generated analysis for educational purposes only. Not financial advice. Always do your own research before investing.
        </span>
      </div>

      {/* Overall signal */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--slate-400)', letterSpacing: '0.06em', marginBottom: 4 }}>OVERALL SIGNAL</div>
          <ActionBadge action={advice.action} />
        </div>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--slate-400)', letterSpacing: '0.06em', marginBottom: 4 }}>RISK LEVEL</div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: rs.bg, borderRadius: 'var(--radius-pill)', padding: '3px 12px', fontSize: '12px', fontWeight: 700, color: rs.color }}>
            {advice.risk}
          </span>
        </div>
        {advice.timeframe && (
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--slate-400)', letterSpacing: '0.06em', marginBottom: 4 }}>TIMEFRAME</div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'var(--slate-100)', borderRadius: 'var(--radius-pill)', padding: '3px 12px', fontSize: '12px', fontWeight: 600, color: 'var(--slate-600)' }}>
              <Clock size={11} /> {advice.timeframe}
            </span>
          </div>
        )}
      </div>

      {/* Reasoning */}
      <div style={{ background: 'var(--slate-50)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4) var(--space-5)', borderLeft: '3px solid #f59e0b' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--slate-400)', letterSpacing: '0.06em', marginBottom: 'var(--space-2)' }}>EXPERT REASONING</div>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-700)', lineHeight: 1.6, margin: 0 }}>
          {advice.reasoning}
        </p>
      </div>

      {/* Affected stocks */}
      {advice.affectedStocks?.length > 0 && (
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--slate-400)', letterSpacing: '0.06em', marginBottom: 'var(--space-3)' }}>AFFECTED STOCKS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {advice.affectedStocks.map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)',
                background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-3) var(--space-4)',
              }}>
                <div style={{ minWidth: 64 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--slate-800)' }}>{s.symbol}</div>
                  <div style={{ fontSize: '11px', color: 'var(--slate-400)', marginTop: 1 }}>{s.name}</div>
                </div>
                <ActionBadge action={s.action} size="sm" />
                <p style={{ flex: 1, fontSize: '12px', color: 'var(--slate-500)', lineHeight: 1.5, margin: 0 }}>
                  {s.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ExpandableSection({ title, icon: IconComp, iconColor, defaultOpen, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: '#fff' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
          width: '100%', padding: 'var(--space-4) var(--space-5)',
          background: open ? 'var(--slate-50)' : '#fff', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font-body)', transition: 'background var(--duration-fast) var(--ease-out)',
        }}
      >
        <IconComp size={18} color={iconColor} />
        <span style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--slate-800)', flex: 1, textAlign: 'left' }}>
          {title}
        </span>
        <div style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--duration-normal) var(--ease-out)' }}>
          <ChevronDown size={16} color="var(--slate-400)" />
        </div>
      </button>
      {open && (
        <div style={{ padding: 'var(--space-5)', borderTop: '1px solid var(--slate-100)', animation: 'fade-slide-in 0.25s var(--ease-out)' }}>
          {children}
        </div>
      )}
    </div>
  );
}

export default function SummaryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { articles, summaryMap } = useApp();

  const contextArticle = articles.find((a) => a._id === id);
  const contextSummary = summaryMap[id];

  const [article, setArticle]   = useState(contextArticle || null);
  const [summary, setSummary]   = useState(contextSummary || null);
  const [loading, setLoading]   = useState(!contextArticle || !contextSummary);
  const [error,   setError]     = useState(null);

  useEffect(() => {
    if (contextArticle && contextSummary) {
      setLoading(false);
      return;
    }
    const fetchBoth = async () => {
      try {
        setLoading(true);
        const [artRes, sumRes] = await Promise.allSettled([
          contextArticle ? null : articlesApi.getById(id),
          contextSummary ? null : summariesApi.getByArticle(id),
        ]);
        if (!contextArticle && artRes.status === 'fulfilled' && artRes.value) {
          setArticle(artRes.value.data.data);
        }
        if (!contextSummary && sumRes.status === 'fulfilled' && sumRes.value) {
          setSummary(sumRes.value.data.data);
        }
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load summary');
      } finally {
        setLoading(false);
      }
    };
    fetchBoth();
  }, [id]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--slate-50)', fontFamily: 'var(--font-body)', color: 'var(--slate-400)',
      }}>
        Loading...
      </div>
    );
  }

  if (error || !article) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--slate-50)', gap: 'var(--space-4)' }}>
        <p style={{ color: '#dc2626', fontFamily: 'var(--font-body)' }}>{error || 'Article not found'}</p>
        <button onClick={() => navigate(-1)} style={{ color: 'var(--blue-600)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
          ← Go back
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--slate-50)' }}>
      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: '#fff', borderBottom: '1px solid var(--slate-200)',
        padding: 'var(--space-4) var(--space-6)',
      }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600,
              color: 'var(--blue-600)', padding: 0, flexShrink: 0,
            }}
          >
            <ArrowLeft size={16} color="var(--blue-600)" /> Back
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flex: 1 }}>
            <div style={{ width: 26, height: 26, borderRadius: 'var(--radius-sm)', background: 'var(--blue-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart2 size={13} color="#fff" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--slate-600)' }}>
              Invest Interview
            </span>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 860, margin: '0 auto', padding: 'var(--space-8) var(--space-6)' }}>
        {/* Article header card */}
        <div style={{
          background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-6) var(--space-8)', marginBottom: 'var(--space-5)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '12px', fontWeight: 700, color: 'var(--blue-600)',
              background: 'var(--blue-50)', padding: '3px 10px', borderRadius: 'var(--radius-pill)',
              letterSpacing: '0.04em', textTransform: 'uppercase',
            }}>
              {article.source}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--slate-400)' }}>{article.date}</span>
            {article.readTime && (
              <span style={{ fontSize: '12px', color: 'var(--slate-400)' }}>{article.readTime}</span>
            )}
            {article.url && (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '12px', color: 'var(--slate-400)', textDecoration: 'none', marginLeft: 'auto' }}
              >
                <ExternalLink size={12} /> Source
              </a>
            )}
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700,
            color: 'var(--slate-900)', lineHeight: 'var(--leading-tight)',
          }}>
            {article.title}
          </h1>
        </div>

        {/* Expandable sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <ExpandableSection title="Simplified version" icon={Sparkles} iconColor="var(--blue-500)" defaultOpen={true}>
            {summary ? (
              <>
                <p style={{ fontSize: 'var(--text-md)', color: 'var(--slate-700)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-5)' }}>
                  {summary.summary}
                </p>
                {summary.keyPoints?.length > 0 && (
                  <div style={{ background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--slate-500)', marginBottom: 'var(--space-3)', letterSpacing: '0.04em' }}>
                      KEY TAKEAWAYS
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      {summary.keyPoints.map((point, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                          <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--blue-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                            <Check size={11} color="var(--blue-600)" strokeWidth={2.5} />
                          </div>
                          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-600)', lineHeight: 'var(--leading-normal)' }}>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-400)', textAlign: 'center', padding: 'var(--space-6) 0' }}>
                Summary not available. Go back to step 4 to generate it.
              </p>
            )}
          </ExpandableSection>

          {summary?.tradeAdvice && (
            <ExpandableSection title="AI Trading Signal" icon={TrendingUp} iconColor="#f59e0b" defaultOpen={true}>
              <TradeAdvicePanel advice={summary.tradeAdvice} />
            </ExpandableSection>
          )}

          <ExpandableSection title="Original article" icon={FileText} iconColor="var(--slate-500)" defaultOpen={false}>
            {(article.fullText || article.preview)
              ? (article.fullText || article.preview).split('\n').filter(Boolean).map((p, i) => (
                  <p key={i} style={{ fontSize: 'var(--text-base)', color: 'var(--slate-600)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-3)' }}>
                    {p}
                  </p>
                ))
              : <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-400)' }}>No original text available.</p>
            }
          </ExpandableSection>
        </div>
      </main>
    </div>
  );
}
