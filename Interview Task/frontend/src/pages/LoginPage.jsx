import { useState } from 'react';
import { BarChart2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--slate-50)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-6)',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-8)' }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 'var(--radius-md)',
          background: 'var(--blue-500)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <BarChart2 size={22} color="#fff" />
        </div>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 'var(--text-xl)',
          color: 'var(--slate-900)',
        }}>
          Invest Interview
        </span>
      </div>

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: 400,
        background: '#fff',
        border: '1px solid var(--slate-200)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-8)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-2xl)',
          fontWeight: 700,
          color: 'var(--slate-900)',
          marginBottom: 'var(--space-1)',
        }}>
          Welcome back
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-500)', marginBottom: 'var(--space-6)' }}>
          Sign in to your admin account
        </p>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={{
              display: 'block',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: 'var(--slate-700)',
              marginBottom: 'var(--space-2)',
            }}>
              Email
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              border: '1.5px solid var(--slate-200)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              background: '#fff',
              transition: 'border-color var(--duration-fast)',
            }}>
              <Mail size={16} color="var(--slate-400)" />
              <input
                type="email"
                placeholder="admin@invest.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--slate-800)',
                  background: 'transparent',
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <label style={{
              display: 'block',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: 'var(--slate-700)',
              marginBottom: 'var(--space-2)',
            }}>
              Password
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              border: '1.5px solid var(--slate-200)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              background: '#fff',
            }}>
              <Lock size={16} color="var(--slate-400)" />
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--slate-800)',
                  background: 'transparent',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPw(s => !s)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
              >
                {showPw
                  ? <EyeOff size={16} color="var(--slate-400)" />
                  : <Eye size={16} color="var(--slate-400)" />
                }
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3) var(--space-4)',
              fontSize: 'var(--text-sm)',
              color: '#dc2626',
              marginBottom: 'var(--space-4)',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? 'var(--blue-300)' : 'var(--blue-500)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background var(--duration-fast)',
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div style={{
          marginTop: 'var(--space-6)',
          paddingTop: 'var(--space-5)',
          borderTop: '1px solid var(--slate-100)',
          background: 'var(--slate-50)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-4)',
          fontSize: '12px',
          color: 'var(--slate-500)',
        }}>
          <strong style={{ color: 'var(--slate-700)' }}>Demo credentials</strong><br />
          Email: admin@invest.com<br />
          Password: password123
        </div>
      </div>
    </div>
  );
}
