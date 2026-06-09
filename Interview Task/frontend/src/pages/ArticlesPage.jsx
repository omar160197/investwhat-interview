import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart2, Search, X, LayoutGrid, List, Newspaper } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ArticleGridCard, ArticleListCard } from '../components/ArticleCard';
import { useAuth } from '../context/AuthContext';

export default function ArticlesPage() {
  const navigate    = useNavigate();
  const { user }    = useAuth();
  const { articles } = useApp();

  const [query,       setQuery]       = useState('');
  const [activeTopic, setActiveTopic] = useState('all');
  const [layout,      setLayout]      = useState('grid');

  const allTopics = [...new Set(articles.flatMap((a) => a.topics || []))].sort();

  const filtered = articles.filter((a) => {
    const matchesTopic = activeTopic === 'all' || a.topics?.includes(activeTopic);
    const q = query.toLowerCase().trim();
    const matchesQuery = !q || a.title.toLowerCase().includes(q) || a.preview?.toLowerCase().includes(q);
    return matchesTopic && matchesQuery;
  });

  const handleView = (article) => navigate(`/articles/${article._id}`);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--slate-50)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: '#fff',
        borderBottom: '1px solid var(--slate-200)',
        padding: 'var(--space-4) var(--space-6)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Top row */}
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
                  All Articles
                </h1>
                <p style={{ fontSize: '11px', color: 'var(--slate-400)', margin: 0, marginTop: 2 }}>
                  {filtered.length} of {articles.length} article{articles.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Layout toggle */}
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

          {/* Search + filters */}
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
              background: 'var(--slate-50)', border: '1.5px solid var(--slate-200)',
              borderRadius: 'var(--radius-lg)', padding: '8px 12px',
              flex: '1 1 220px', minWidth: 160,
            }}>
              <Search size={14} color="var(--slate-400)" />
              <input
                type="text"
                placeholder="Search by title or content..."
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

            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              {['all', ...allTopics].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTopic(t)}
                  style={{
                    padding: '6px 14px', borderRadius: 'var(--radius-pill)', border: 'none',
                    cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                    fontFamily: 'var(--font-body)',
                    textTransform: t === 'all' ? 'none' : 'uppercase',
                    letterSpacing: t === 'all' ? 0 : '0.04em',
                    background: activeTopic === t ? 'var(--blue-500)' : 'var(--slate-100)',
                    color: activeTopic === t ? '#fff' : 'var(--slate-600)',
                    transition: 'all var(--duration-fast)',
                  }}
                >
                  {t === 'all' ? 'All topics' : t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main style={{ flex: 1, padding: 'var(--space-8) var(--space-6)', maxWidth: 1200, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        {articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-24)' }}>
            <Newspaper size={40} color="var(--slate-300)" style={{ margin: '0 auto var(--space-4)' }} />
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--slate-500)', marginBottom: 'var(--space-2)' }}>
              No articles yet
            </p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-400)', marginBottom: 'var(--space-5)' }}>
              Go back to the home page and search for topics first.
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
              <ArticleGridCard key={article._id} article={article} onView={handleView} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxWidth: 860, margin: '0 auto' }}>
            {filtered.map((article, i) => (
              <ArticleListCard key={article._id} article={article} index={i} onView={handleView} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
