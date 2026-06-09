import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import SummariesPage from './pages/SummariesPage';
import SummaryDetailPage from './pages/SummaryDetailPage';

function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--slate-50)', fontFamily: 'var(--font-body)', color: 'var(--slate-400)',
      }}>
        Loading...
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--slate-50)', fontFamily: 'var(--font-body)', color: 'var(--slate-400)',
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/articles" element={<ProtectedRoute><ArticlesPage /></ProtectedRoute>} />
      <Route path="/articles/:id" element={<ProtectedRoute><ArticleDetailPage /></ProtectedRoute>} />
      <Route path="/summaries" element={<ProtectedRoute><SummariesPage /></ProtectedRoute>} />
      <Route path="/summaries/:id" element={<ProtectedRoute><SummaryDetailPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
