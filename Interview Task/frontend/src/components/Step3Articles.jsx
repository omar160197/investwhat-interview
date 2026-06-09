import { useNavigate } from 'react-router-dom';
import { Sparkles, BookOpen } from 'lucide-react';
import Button from './ui/Button';
import FadeIn from './ui/FadeIn';
import { ArticleGridCard } from './ArticleCard';

const PREVIEW_COUNT = 6;

export default function Step3Articles({ articles, onContinue }) {
  const navigate = useNavigate();
  const preview   = articles.slice(0, PREVIEW_COUNT);
  const remaining = articles.length - PREVIEW_COUNT;

  return (
    <div>
      <FadeIn>
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--slate-900)', marginBottom: 'var(--space-1)' }}>
            Your articles are ready
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-500)' }}>
            Showing {preview.length} of {articles.length} article{articles.length !== 1 ? 's' : ''}
          </p>
        </div>
      </FadeIn>

      {/* Preview grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-5)',
      }}>
        {preview.map((article) => (
          <FadeIn key={article._id} delay={0}>
            <ArticleGridCard
              article={article}
              onView={(a) => navigate(`/articles/${a._id}`)}
            />
          </FadeIn>
        ))}
      </div>

      {/* View all button */}
      {remaining > 0 && (
        <FadeIn delay={80}>
          <button
            onClick={() => navigate('/articles')}
            style={{
              width: '100%',
              padding: 'var(--space-4)',
              background: '#fff',
              border: '1.5px dashed var(--slate-300)',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: 'var(--slate-500)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-2)',
              marginBottom: 'var(--space-6)',
              transition: 'all var(--duration-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--blue-400)';
              e.currentTarget.style.color = 'var(--blue-600)';
              e.currentTarget.style.background = 'var(--blue-50)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--slate-300)';
              e.currentTarget.style.color = 'var(--slate-500)';
              e.currentTarget.style.background = '#fff';
            }}
          >
            <BookOpen size={16} />
            View all {articles.length} articles
          </button>
        </FadeIn>
      )}

      <FadeIn delay={120}>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--slate-200)' }}>
          <Button onClick={onContinue} size="lg">
            <Sparkles size={18} color="#fff" />
            Simplify these articles
          </Button>
        </div>
      </FadeIn>
    </div>
  );
}
