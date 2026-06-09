import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, ExternalLink, Loader, BarChart2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import * as articlesApi from '../api/articles.api.js';
import { SOURCE_COLORS, defaultSourceColor } from '../components/ArticleCard';

export default function ArticleDetailPage() {
  const { id }        = useParams();
  const navigate      = useNavigate();
  const { articles }  = useApp();

  const fromContext   = articles.find((a) => a._id === id);
  const [article,  setArticle]  = useState(fromContext || null);
  const [fullText, setFullText] = useState(fromContext?.fullText || '');
  const [loading,  setLoading]  = useState(!fromContext);
  const [fetching, setFetching] = useState(false);

  // If not in context (e.g. direct URL), fetch from API
  useEffect(() => {
    if (fromContext) return;
    setLoading(true);
    articlesApi.getById(id)
      .then((r) => {
        setArticle(r.data.data);
        setFullText(r.data.data.fullText || '');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  // Fetch full content if still empty after article is loaded
  useEffect(() => {
    if (!article || fullText || fetching) return;
    setFetching(true);
    articlesApi.fetchContent(id)
      .then((r) => setFullText(r.data.data.fullText || ''))
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [article, id]);

  const color = article ? (SOURCE_COLORS[article.source] || defaultSourceColor) : defaultSourceColor;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--slate-50)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: '#fff',
        borderBottom: '1px solid var(--slate-200)',
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
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--slate-900)' }}>
              Invest Interview
            </span>
          </div>

          {article && (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--slate-400)', textDecoration: 'none', flexShrink: 0 }}
            >
              <ExternalLink size={14} /> View original
            </a>
          )}
        </div>
      </header>

      {/* Content */}
      <main style={{ flex: 1, padding: 'var(--space-8) var(--space-6)', maxWidth: 860, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 'var(--space-3)', color: 'var(--slate-400)' }}>
            <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
            Loading article...
          </div>
        ) : !article ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
            <p style={{ color: 'var(--slate-500)', marginBottom: 'var(--space-4)' }}>Article not found.</p>
            <button onClick={() => navigate('/')} style={{ color: 'var(--blue-600)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
              ← Go to home
            </button>
          </div>
        ) : (
          <article style={{ animation: 'fade-slide-in 0.3s var(--ease-out)' }}>
            {/* Article header card */}
            <div style={{
              background: '#fff',
              border: '1px solid var(--slate-200)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-8)',
              marginBottom: 'var(--space-6)',
              boxShadow: 'var(--shadow-xs)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: color.text, background: color.bg, padding: '3px 12px', borderRadius: 'var(--radius-pill)' }}>
                  {article.source}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--slate-400)' }}>{article.date}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '13px', color: 'var(--slate-400)' }}>
                  <Clock size={13} /> {article.readTime}
                </span>
                <div style={{ display: 'flex', gap: 6, marginLeft: 'auto', flexWrap: 'wrap' }}>
                  {article.topics?.map((t) => (
                    <span key={t} style={{ fontSize: '10px', fontWeight: 600, color: 'var(--slate-500)', background: 'var(--slate-100)', padding: '2px 8px', borderRadius: 'var(--radius-pill)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                fontWeight: 800,
                color: 'var(--slate-900)',
                lineHeight: 'var(--leading-tight)',
                marginBottom: 'var(--space-4)',
              }}>
                {article.title}
              </h1>

              {article.preview && (
                <p style={{ fontSize: 'var(--text-md)', color: 'var(--slate-500)', lineHeight: 'var(--leading-relaxed)', fontStyle: 'italic', borderLeft: '3px solid var(--blue-200)', paddingLeft: 'var(--space-4)', margin: 0 }}>
                  {article.preview}
                </p>
              )}
            </div>

            {/* Article body */}
            <div style={{
              background: '#fff',
              border: '1px solid var(--slate-200)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-8)',
              boxShadow: 'var(--shadow-xs)',
            }}>
              {fetching ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', color: 'var(--slate-400)', fontSize: 'var(--text-sm)' }}>
                  <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  Fetching article content...
                </div>
              ) : fullText ? (
                <div style={{ fontSize: 'var(--text-md)', color: 'var(--slate-700)', lineHeight: 'var(--leading-relaxed)' }}>
                  {fullText.split('\n\n').map((para, i) => (
                    <p key={i} style={{ marginBottom: 'var(--space-5)', margin: i < fullText.split('\n\n').length - 1 ? '0 0 var(--space-5)' : 0 }}>
                      {para}
                    </p>
                  ))}
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: 'var(--text-md)', color: 'var(--slate-600)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-5)' }}>
                    Full content could not be retrieved for this article.
                  </p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
                      padding: 'var(--space-3) var(--space-5)',
                      background: 'var(--blue-500)', color: '#fff',
                      borderRadius: 'var(--radius-pill)', textDecoration: 'none',
                      fontSize: 'var(--text-sm)', fontWeight: 600, fontFamily: 'var(--font-body)',
                    }}
                  >
                    <ExternalLink size={14} /> Read on {article.source}
                  </a>
                </div>
              )}
            </div>
          </article>
        )}
      </main>
    </div>
  );
}
