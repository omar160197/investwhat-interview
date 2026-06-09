import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Mail, Bell, Users, ListChecks, Check, CheckCircle, Search, RefreshCw, ArrowRight, FileText, Send, Loader, Sparkles } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { useApp } from '../context/AppContext';
import Button from './ui/Button';
import FadeIn from './ui/FadeIn';
import * as dispatchApi from '../api/dispatch.api.js';

export default function Step5Send({ articles, onStartOver }) {
  const { summaryMap } = useApp();
  const { data: usersData, isLoading: usersLoading } = useUsers({});
  const users = usersData?.users || [];

  const summarizedArticles = articles.filter((a) => summaryMap[a._id]);

  const [selectedIds,   setSelectedIds]   = useState(() => summarizedArticles.map((a) => a._id));
  const [sendMethod,    setSendMethod]    = useState(null);
  const [audienceType,  setAudienceType]  = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userSearch,    setUserSearch]    = useState('');
  const [phase,         setPhase]         = useState('select');
  const [sendError,     setSendError]     = useState('');

  const dispatchMutation = useMutation({
    mutationFn: (payload) => dispatchApi.send(payload).then((r) => r.data.data),
    onSuccess: () => setPhase('success'),
    onError:   (err) => {
      setSendError(err?.response?.data?.message || 'Failed to send');
      setPhase('select');
    },
  });

  const toggleArticle = (id) =>
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const toggleUser = (id) =>
    setSelectedUsers((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const toggleAllUsers = () =>
    setSelectedUsers(selectedUsers.length === users.length ? [] : users.map((u) => u._id));

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleSend = () => {
    setSendError('');
    setPhase('sending');
    dispatchMutation.mutate({
      articleIds:   selectedIds,
      audience:     audienceType,
      recipientIds: audienceType === 'specific' ? selectedUsers : undefined,
    });
  };

  const selectedArticles = summarizedArticles.filter((a) => selectedIds.includes(a._id));
  const audienceLabel    = audienceType === 'all'
    ? 'all subscribed users'
    : `${selectedUsers.length} selected user${selectedUsers.length !== 1 ? 's' : ''}`;
  const canReview = selectedIds.length > 0 && sendMethod === 'email' && (audienceType === 'all' || selectedUsers.length > 0);

  const sectionLabel = {
    fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--slate-400)',
    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-3)',
  };

  /* ── SENDING ── */
  if (phase === 'sending') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, textAlign: 'center' }}>
        <FadeIn>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', background: 'var(--blue-50)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto var(--space-6)', animation: 'pulse-ring 1.5s ease-in-out infinite',
          }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--blue-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={24} color="var(--blue-500)" />
            </div>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--slate-900)', marginBottom: 'var(--space-2)' }}>
            Sending to {audienceLabel}...
          </h2>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--slate-500)', marginBottom: 'var(--space-4)' }}>
            Delivering {selectedIds.length} article{selectedIds.length !== 1 ? 's' : ''} via email
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', justifyContent: 'center', color: 'var(--slate-400)', fontSize: 'var(--text-sm)' }}>
            <Loader size={14} color="var(--blue-400)" />
            Please wait...
          </div>
        </FadeIn>
      </div>
    );
  }

  /* ── SUCCESS ── */
  if (phase === 'success') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, textAlign: 'center' }}>
        <FadeIn>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-6)', animation: 'fade-slide-in 0.5s var(--ease-out)' }}>
            <CheckCircle size={40} color="var(--success)" strokeWidth={1.5} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--slate-900)', marginBottom: 'var(--space-3)' }}>
            Sent successfully
          </h2>
          <p style={{ fontSize: 'var(--text-md)', color: 'var(--slate-500)', maxWidth: 440, margin: '0 auto var(--space-8)', lineHeight: 'var(--leading-relaxed)' }}>
            {selectedIds.length} article{selectedIds.length !== 1 ? 's' : ''} sent to {audienceLabel} via email.
          </p>

          <div style={{ background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5) var(--space-6)', maxWidth: 480, margin: '0 auto var(--space-8)', textAlign: 'left' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-4)' }}>
              Delivery summary
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', background: 'var(--success-light)', borderRadius: 'var(--radius-md)' }}>
                <CheckCircle size={18} color="var(--success-dark)" />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--success-dark)', fontWeight: 500 }}>All deliveries completed</span>
              </div>
              {selectedArticles.map((a) => (
                <div key={a._id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <Check size={16} color="var(--success)" />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-600)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {a.title}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--slate-100)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Mail size={14} color="var(--slate-400)" />
              <span style={{ fontSize: '12px', color: 'var(--slate-400)' }}>Delivered via email digest · Just now</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
            <Button variant="secondary" onClick={onStartOver}><RefreshCw size={16} /> Start over</Button>
            <Button onClick={() => { setPhase('select'); setSendMethod(null); setAudienceType('all'); setSelectedUsers([]); }}>
              Send more articles
            </Button>
          </div>
        </FadeIn>
      </div>
    );
  }

  /* ── SELECT / CONFIRM ── */
  return (
    <div>
      <FadeIn>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--slate-900)', marginBottom: 'var(--space-2)' }}>
            Send to users
          </h2>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--slate-500)', maxWidth: 480, margin: '0 auto' }}>
            Choose articles, delivery method, and target audience.
          </p>
        </div>
      </FadeIn>

      {/* Article selection */}
      <FadeIn delay={80}>
        {summarizedArticles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-10) var(--space-4)', background: '#fff', border: '1.5px dashed var(--slate-300)', borderRadius: 'var(--radius-xl)', marginBottom: 'var(--space-8)' }}>
            <Sparkles size={28} color="var(--slate-300)" style={{ margin: '0 auto var(--space-3)' }} />
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--slate-500)', marginBottom: 'var(--space-1)' }}>
              No simplified articles yet
            </p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--slate-400)' }}>
              Go back to step 4 and simplify some articles first.
            </p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
              <div style={sectionLabel}>
                Simplified articles — {selectedIds.length} of {summarizedArticles.length} selected
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button
                  onClick={() => setSelectedIds(summarizedArticles.map((a) => a._id))}
                  style={{ background: 'none', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)', padding: '4px 10px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, color: 'var(--slate-500)' }}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedIds([])}
                  style={{ background: 'none', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)', padding: '4px 10px', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, color: 'var(--slate-500)' }}
                >
                  None
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-8)' }}>
              {summarizedArticles.map((article, index) => {
                const selected    = selectedIds.includes(article._id);
                const summaryData = summaryMap[article._id];
                const keyPoints   = summaryData?.keyPoints?.slice(0, 2) || [];
                return (
                  <div
                    key={article._id}
                    onClick={() => toggleArticle(article._id)}
                    style={{
                      display: 'flex', alignItems: 'stretch',
                      background: selected ? 'var(--blue-50)' : '#fff',
                      border: `2px solid ${selected ? 'var(--blue-300)' : 'var(--slate-200)'}`,
                      borderRadius: 'var(--radius-xl)', cursor: 'pointer',
                      overflow: 'hidden',
                      transition: 'all var(--duration-fast) var(--ease-out)',
                    }}
                  >
                    {/* Number stripe */}
                    <div style={{
                      width: 44, flexShrink: 0,
                      background: selected ? 'var(--blue-500)' : 'var(--slate-50)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRight: `1px solid ${selected ? 'var(--blue-400)' : 'var(--slate-100)'}`,
                      transition: 'all var(--duration-fast)',
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700,
                        color: selected ? '#fff' : 'var(--slate-400)',
                      }}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0, padding: 'var(--space-4) var(--space-5)' }}>
                      {/* Meta row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)', flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: '10px', fontWeight: 700, color: 'var(--blue-600)',
                          background: 'var(--blue-50)', padding: '1px 7px', borderRadius: 'var(--radius-pill)',
                          letterSpacing: '0.04em', textTransform: 'uppercase', border: '1px solid var(--blue-100)',
                        }}>
                          {article.source}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--slate-400)' }}>{article.date}</span>
                        {article.readTime && (
                          <span style={{ fontSize: '11px', color: 'var(--slate-400)' }}>{article.readTime}</span>
                        )}
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'linear-gradient(90deg,#eff6ff,#f0fdf4)', border: '1px solid #bfdbfe', borderRadius: 'var(--radius-pill)', padding: '1px 7px' }}>
                          <Sparkles size={9} color="var(--blue-500)" />
                          <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--blue-600)', letterSpacing: '0.04em' }}>SIMPLIFIED</span>
                        </span>
                      </div>

                      {/* Title */}
                      <div style={{
                        fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 700,
                        color: 'var(--slate-800)', lineHeight: 'var(--leading-tight)', marginBottom: 'var(--space-2)',
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>
                        {article.title}
                      </div>

                      {/* Summary preview */}
                      <p style={{
                        fontSize: 'var(--text-sm)', color: 'var(--slate-500)', lineHeight: 1.5,
                        margin: '0 0 var(--space-3)',
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>
                        {summaryData.summary}
                      </p>

                      {/* Key points */}
                      {keyPoints.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                          {keyPoints.map((pt, i) => (
                            <span key={i} style={{
                              display: 'inline-flex', alignItems: 'center', gap: 4,
                              background: selected ? 'var(--blue-100)' : 'var(--slate-100)',
                              borderRadius: 'var(--radius-pill)', padding: '2px 10px',
                              fontSize: '11px', color: selected ? 'var(--blue-700)' : 'var(--slate-500)',
                              transition: 'all var(--duration-fast)',
                              maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>
                              <Check size={9} strokeWidth={3} /> {pt}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Checkbox */}
                    <div style={{ display: 'flex', alignItems: 'center', padding: '0 var(--space-4)' }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: 'var(--radius-sm)', flexShrink: 0,
                        border: selected ? '2px solid var(--blue-500)' : '2px solid var(--slate-300)',
                        background: selected ? 'var(--blue-500)' : '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all var(--duration-fast) var(--ease-out)',
                      }}>
                        {selected && <Check size={14} color="#fff" strokeWidth={2.5} />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </FadeIn>

      {/* Delivery method */}
      <FadeIn delay={160}>
        <div style={sectionLabel}>Delivery method</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-8)' }}>
          {[
            { key: 'email',        Icon: Mail, label: 'Email',             desc: 'Send a digest email' },
            { key: 'notification', Icon: Bell, label: 'Push notification', desc: 'Coming soon' },
          ].map(({ key, Icon, label, desc }) => {
            const active    = sendMethod === key;
            const disabled  = key === 'notification';
            return (
              <button key={key} onClick={() => !disabled && setSendMethod(key)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)',
                padding: 'var(--space-5) var(--space-4)',
                background: active ? 'var(--blue-50)' : disabled ? 'var(--slate-50)' : '#fff',
                border: active ? '2px solid var(--blue-400)' : '2px solid var(--slate-200)',
                borderRadius: 'var(--radius-lg)', cursor: disabled ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-body)', transition: 'all var(--duration-fast) var(--ease-out)',
                textAlign: 'center', opacity: disabled ? 0.5 : 1,
              }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: active ? 'var(--blue-100)' : 'var(--slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color={active ? 'var(--blue-600)' : 'var(--slate-400)'} />
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: active ? 'var(--blue-700)' : 'var(--slate-800)' }}>{label}</div>
                  <div style={{ fontSize: '12px', color: 'var(--slate-400)', marginTop: 2 }}>{desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </FadeIn>

      {/* Audience */}
      <FadeIn delay={240}>
        <div style={sectionLabel}>Audience</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: audienceType === 'specific' ? 'var(--space-4)' : 'var(--space-8)' }}>
          {[
            { key: 'all',      Icon: Users,      label: 'All users',      desc: 'Send to everyone subscribed' },
            { key: 'specific', Icon: ListChecks, label: 'Specific users', desc: 'Choose individual recipients' },
          ].map(({ key, Icon, label, desc }) => {
            const active = audienceType === key;
            return (
              <button key={key} onClick={() => { setAudienceType(key); if (key === 'all') setSelectedUsers([]); }} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)',
                padding: 'var(--space-5) var(--space-4)',
                background: active ? 'var(--blue-50)' : '#fff',
                border: active ? '2px solid var(--blue-400)' : '2px solid var(--slate-200)',
                borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                fontFamily: 'var(--font-body)', transition: 'all var(--duration-fast) var(--ease-out)',
                textAlign: 'center',
              }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: active ? 'var(--blue-100)' : 'var(--slate-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color={active ? 'var(--blue-600)' : 'var(--slate-400)'} />
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: active ? 'var(--blue-700)' : 'var(--slate-800)' }}>{label}</div>
                  <div style={{ fontSize: '12px', color: 'var(--slate-400)', marginTop: 2 }}>{desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* User list */}
        {audienceType === 'specific' && (
          <div style={{ border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 'var(--space-8)', animation: 'fade-slide-in 0.3s var(--ease-out)' }}>
            <div style={{ padding: 'var(--space-3) var(--space-4)', background: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flex: 1, background: '#fff', border: '1px solid var(--slate-200)', borderRadius: 'var(--radius-md)', padding: '6px 10px' }}>
                <Search size={14} color="var(--slate-400)" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  style={{ border: 'none', outline: 'none', flex: 1, fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', background: 'transparent', color: 'var(--slate-800)' }}
                />
              </div>
              <button onClick={toggleAllUsers} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 600, color: 'var(--blue-600)', whiteSpace: 'nowrap' }}>
                {selectedUsers.length === users.length ? 'Deselect all' : 'Select all'}
              </button>
            </div>

            <div style={{ maxHeight: 280, overflowY: 'auto' }}>
              {usersLoading ? (
                <div style={{ padding: 'var(--space-6)', textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--slate-400)' }}>
                  Loading users...
                </div>
              ) : filteredUsers.map((user) => {
                const checked = selectedUsers.includes(user._id);
                return (
                  <label key={user._id} style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                    padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--slate-100)',
                    cursor: 'pointer', background: checked ? 'var(--blue-50)' : '#fff',
                    transition: 'background var(--duration-fast) var(--ease-out)',
                  }}>
                    <div onClick={() => toggleUser(user._id)} style={{
                      width: 20, height: 20, borderRadius: 'var(--radius-sm)',
                      border: checked ? '2px solid var(--blue-500)' : '2px solid var(--slate-300)',
                      background: checked ? 'var(--blue-500)' : '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, cursor: 'pointer',
                    }}>
                      {checked && <Check size={12} color="#fff" strokeWidth={2.5} />}
                    </div>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--blue-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--blue-600)', fontFamily: 'var(--font-mono)' }}>{user.avatar}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }} onClick={() => toggleUser(user._id)}>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--slate-800)' }}>{user.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--slate-400)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                    </div>
                  </label>
                );
              })}
              {!usersLoading && filteredUsers.length === 0 && (
                <div style={{ padding: 'var(--space-6)', textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--slate-400)' }}>
                  No users match your search
                </div>
              )}
            </div>

            <div style={{ padding: 'var(--space-3) var(--space-4)', background: 'var(--slate-50)', borderTop: '1px solid var(--slate-200)', fontSize: '12px', color: 'var(--slate-400)' }}>
              {selectedUsers.length} of {users.length} users selected
            </div>
          </div>
        )}
      </FadeIn>

      {/* Confirm panel */}
      {phase === 'confirm' && sendMethod && (
        <FadeIn>
          <div style={{ background: 'var(--blue-50)', border: '1px solid var(--blue-200)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5) var(--space-6)', marginBottom: 'var(--space-6)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--blue-800)', marginBottom: 'var(--space-3)' }}>
              Confirm send
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--blue-700)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <FileText size={15} color="var(--blue-500)" />
                <span><strong>{selectedIds.length}</strong> article{selectedIds.length !== 1 ? 's' : ''}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Mail size={15} color="var(--blue-500)" />
                <span>Via <strong>email digest</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Users size={15} color="var(--blue-500)" />
                <span>To <strong>{audienceLabel}</strong></span>
              </div>
            </div>
          </div>
        </FadeIn>
      )}

      {sendError && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)', color: '#dc2626', marginBottom: 'var(--space-4)' }}>
          {sendError}
        </div>
      )}

      {/* Actions */}
      <FadeIn delay={320}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--slate-200)' }}>
          <Button variant="ghost" onClick={onStartOver}><RefreshCw size={16} /> Start over</Button>
          {phase === 'select' ? (
            <Button disabled={!canReview} onClick={() => setPhase('confirm')}>
              Review send <ArrowRight size={18} color="#fff" />
            </Button>
          ) : (
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <Button variant="secondary" onClick={() => setPhase('select')}>Back</Button>
              <Button onClick={handleSend}>
                <Send size={16} color="#fff" /> Send now
              </Button>
            </div>
          )}
        </div>
      </FadeIn>
    </div>
  );
}
