import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart2, Search, X, LayoutGrid, List, Sparkles, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';

function SummaryGridCard({ article, summaryData, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        background: '#fff',
        border: '1px solid var(--slate-200)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all var(--duration-normal) var(--ease-out)',
        boxShadow: hovered ? 'var(--shadow-sm)' : 'none',
        transform: hovered ? 'translateY(-2px)' : 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ height: 3, background: 'linear-gradient(90deg, var(--blue-400), var(--blue-600))', flexShrink: 0 }} />
      <div style={{ padding: 'var(--space-4)', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '11px', fontWeight: 700, color: 'var(--blue-600)',
            background: 'var(--blue-50)', padding: '2px 8px', borderRadius: 'var(--radius-pill)',
            letterSpacing: '0.04em', textTransform: 'uppercase',
          }}>
            {article.source}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--slate-400)' }}>{article.date}</span>
        </div>

        <h3 style={{
          fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 600,
          color: 'var(--slate-800)', lineHeight: 'var(--leading-tight)', marginBottom: 'var(--space-3)',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {article.title}
        </h3>

        <div style={{ flex: 1 }}>
          {summaryData ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', marginBottom: 'var(--space-2)' }}>
                <Sparkles size={12} color="var(--blue-500)" />
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--blue-600)', letterSpacing: '0.04em' }}>SIMPLIFIED</span>
              </div>
              <p style={{
                fontSize: 'var(--text-sm)', color: 'var(--slate-600)', lineHeight: 'var(--leading-relaxed)',
                display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                {summaryData.summary}
              </p>
            </>
          ) : (
            <div style={{ padding: 'var(--space-3)', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-400)' }}>Summary not available</span>
            </div>
          )}
        </div>

        <div style={{ marginTop: 'var(--space-3)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--slate-100)' }}>
          <span style={{
            fontSize: 'var(--text-sm)', fontWeight: 600, color: hovered ? 'var(--blue-700)' : 'var(--blue-600)',
            display: 'flex', alignItems: 'center', gap: 'var(--space-1)',
          }}>
            <Eye size={13} /> View summary
          </span>
        </div>
      </div>
    </div>
  );
}

function SummaryListCard({ article, summaryData, index, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        background: '#fff',
        border: '1px solid var(--slate-200)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all var(--duration-normal) var(--ease-out)',
        boxShadow: hovered ? 'var(--shadow-sm)' : 'none',
        display: 'flex',
      }}
    >
      <div style={{
        width: 44, flexShrink: 0,
        background: hovered ? 'var(--blue-500)' : 'var(--slate-50)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background var(--duration-fast)',
        borderRight: '1px solid var(--slate-100)',
      }}>
        <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: hovered ? '#fff' : 'var(--slate-400)' }}>
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div style={{ flex: 1, padding: 'var(--space-4) var(--space-5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
          <span style={{
            fontSize: '11px', fontWeight: 700, color: 'var(--blue-600)',
            background: 'var(--blue-50)', padding: '2px 8px', borderRadius: 'var(--radius-pill)',
            letterSpacing: '0.04em', textTransform: 'uppercase',
          }}>
            {article.source}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--slate-400)' }}>{article.date}</span>
        </div>
        <h3 style={{
          fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 600,
          color: 'var(--slate-800)', lineHeight: 'var(--leading-tight)', marginBottom: 'var(--space-2)',
          display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {article.title}
        </h3>
        {summaryData ? (
          <p style={{
            fontSize: 'var(--text-sm)', color: 'var(--slate-500)', lineHeight: 'var(--leading-relaxed)',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {summaryData.summary}
          </p>
        ) : (
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-400)' }}>Summary not available</span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', paddingRight: 'var(--space-4)' }}>
        <Eye size={16} color={hovered ? 'var(--blue-500)' : 'var(--slate-300)'} style={{ transition: 'color var(--duration-fast)' }} />
      </div>
    </div>
  );
}

export default function SummariesPage() {
  const navigate = useNavigate();
  const { articles, summaryMap } = useApp();

  const [query,  setQuery]  = useState('');
  const [layout, setLayout] = useState('grid');

  const filtered = articles.filter((a) => {
    const q = query.toLowerCase().trim();
    const summary = summaryMap[a._id]?.summary || '';
    return !q || a.title.toLowerCase().includes(q) || summary.toLowerCase().includes(q);
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--slate-50)', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: '#fff',
        borderBottom: '1px solid var(--slate-200)',
        padding: 'var(--space-4) var(--space-6)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600,
                color: 'var(--blue-600)', padding: 0, flexShrink: 0,
              }}
            >
              <ArrowLeft size={16} color="var(--blue-600)" /> Back
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: 1 }}>
              <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: 'var(--blue-500)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BarChart2 size={15} color="#fff" />
              </div>
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--slate-900)', margin: 0, lineHeight: 1 }}>
                  Simplified Articles
                </h1>
                <p style={{ fontSize: '11px', color: 'var(--slate-400)', margin: 0, marginTop: 2 }}>
                  {filtered.length} of {articles.length} article{articles.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0 }}>
              {[['grid', LayoutGrid], ['list', List]].map(([mode, Icon]) => (
                <button
                  key={mode}
                  onClick={() => setLayout(mode)}
                  style={{
                    padding: '7px 11px', border: 'none', cursor: 'pointer',
                    background: layout === mode ? 'var(--blue-500)' : '#fff',
                    display: 'flex', alignItems: 'center',
                    transition: 'background var(--duration-fast)',
                  }}
                >
                  <Icon size={14} color={layout === mode ? '#fff' : 'var(--slate-400)'} />
                </button>
              ))}
            </div>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
            background: 'var(--slate-50)', border: '1.5px solid var(--slate-200)',
            borderRadius: 'var(--radius-lg)', padding: '8px 12px',
          }}>
            <Search size={14} color="var(--slate-400)" />
            <input
              type="text"
              placeholder="Search by title or summary..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ flex: 1, border: 'none', outline: 'none', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--slate-800)', background: 'transparent' }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}>
                <X size={13} color="var(--slate-400)" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main style={{ flex: 1, padding: 'var(--space-8) var(--space-6)', maxWidth: 1200, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        {articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-24)' }}>
            <Sparkles size={40} color="var(--slate-300)" style={{ margin: '0 auto var(--space-4)' }} />
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--slate-500)', marginBottom: 'var(--space-2)' }}>
              No simplified articles yet
            </p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-400)', marginBottom: 'var(--space-5)' }}>
              Go back and complete the simplification step first.
            </p>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: 'var(--space-3) var(--space-6)', borderRadius: 'var(--radius-pill)',
                background: 'var(--blue-500)', color: '#fff', border: 'none',
                cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600,
              }}
            >
              ← Go to home
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-16)', color: 'var(--slate-400)', fontSize: 'var(--text-sm)' }}>
            No articles match your search.
          </div>
        ) : layout === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
            {filtered.map((article) => (
              <SummaryGridCard
                key={article._id}
                article={article}
                summaryData={summaryMap[article._id]}
                onClick={() => navigate(`/summaries/${article._id}`)}
              />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxWidth: 860, margin: '0 auto' }}>
            {filtered.map((article, i) => (
              <SummaryListCard
                key={article._id}
                article={article}
                summaryData={summaryMap[article._id]}
                index={i}
                onClick={() => navigate(`/summaries/${article._id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
