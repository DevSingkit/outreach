// app/(public)/chatbot/[token]/page.tsx
'use client';

import { use, useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { supabase } from '@/lib/supabase-client';

const IconPaw = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C10.34 2 9 3.34 9 5s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-5 4C5.34 6 4 7.34 4 9s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm10 0c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM5.5 14C3.57 14 2 15.57 2 17.5S3.57 21 5.5 21c.96 0 1.83-.38 2.48-1H16c.65.62 1.52 1 2.48 1C20.43 21 22 19.43 22 17.5S20.43 14 18.48 14c-1.5 0-2.78.87-3.43 2.13C14.57 16.05 13.82 16 13 16h-2c-.82 0-1.57.05-2.05.13C8.3 14.87 7.02 14 5.5 14z" />
  </svg>
);
const IconSend = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const IconAlert = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const IconClock = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconLock = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export default function ChatbotPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [expired, setExpired] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!token.startsWith('nhvc_')) setInvalid(true);
  }, [token]);

  const { data: session, error: sessionError } = useSWR(
  invalid ? null : `chatbot-session-${token}`,
  async () => {
    const { data, error } = await supabase
      .from('chatbot_sessions')
      .select('session_id, expires_at')
      .eq('session_token', token)
      .gt('expires_at', new Date().toISOString())
      .single();
    if (error) throw new Error('expired');
    return data;
  }
) as { data: { session_id: string; expires_at: string } | undefined; error: unknown };

  const { data: history } = useSWR(
  session ? `history-${session.session_id}` : null,
  async () => {
    const { data } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('session_id', session!.session_id)
      .order('created_at', { ascending: true });
    return data;
  }
) as { data: { role: string; content: string }[] | undefined };

  useEffect(() => {
    if (history && messages.length === 0) setMessages(history);
  }, [history]);

  const expiresAt = session ? new Date(session.expires_at) : null;
  const expiringSoon = expiresAt ? (expiresAt.getTime() - Date.now()) < 24 * 60 * 60 * 1000 : false;

  useEffect(() => {
    if (sessionError) setExpired(true);
  }, [sessionError]);

  const handleSend = async () => {
  if (!input.trim() || isSending || expired || !session) return;
  const userMsg = input.trim().slice(0, 2000);
  setInput('');
  setMessages(m => [...m, { role: 'user', content: userMsg }]);
  setIsSending(true);
  try {
    // Save user message
    await supabase.from('chat_messages').insert({
      session_id: session.session_id,
      role: 'user',
      content: userMsg,
    });
    // TODO: reconnect AI response via API route later
    const reply = 'AI response coming soon — API route not yet connected.';
    await supabase.from('chat_messages').insert({
      session_id: session.session_id,
      role: 'assistant',
      content: reply,
    });
    setMessages(m => [...m, { role: 'assistant', content: reply }]);
  } catch (err: unknown) {
    setMessages(m => [...m, { role: 'assistant', content: 'Something went wrong. Please try again.' }]);
  } finally {
    setIsSending(false);
    inputRef.current?.focus();
  }
};

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Invalid token screen ──
  if (invalid) {
    return (
      <div style={{ minHeight: '100vh', background: '#EDEDED', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{
          background: '#fff', borderRadius: 20, padding: '48px 32px',
          textAlign: 'center', maxWidth: 380,
          boxShadow: '0 12px 40px rgba(97,0,164,0.06)',
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: '#FEF2F2', color: '#C0392B',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <IconAlert size={32} />
          </div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 700, color: '#3A3A3A', margin: '0 0 8px' }}>
            Invalid Link
          </h2>
          <p style={{ color: '#6B6B6B', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
            This chatbot link is not valid. Please use the link provided in your post-op discharge email.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#EDEDED', display: 'flex', flexDirection: 'column', fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* ── Header ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(123,44,191,0.08)',
        padding: '0 20px',
        height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Avatar */}
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, #7B2CBF, #A66DD4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', flexShrink: 0,
            boxShadow: '0 4px 12px rgba(123,44,191,0.25)',
          }}>
            <IconPaw size={18} />
          </div>
          <div>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 700, color: '#3A3A3A', lineHeight: 1.2 }}>
              NHVC Post-op Care Assistant
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
              {!expired && (
                <span style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: '#7ED957',
                  display: 'inline-block',
                  boxShadow: '0 0 0 2px rgba(126,217,87,0.25)',
                }} />
              )}
              <span style={{ fontSize: 11, color: expired ? '#C0392B' : '#6B6B6B', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                {expired ? 'Session expired' : 'Online · Northern Hills Vet'}
              </span>
            </div>
          </div>
        </div>

        {/* Expiry badge */}
        {expiringSoon && !expired && expiresAt && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: '#FEF9EC', borderRadius: 100,
            padding: '5px 12px',
            fontSize: 11, color: '#B45309',
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600,
          }}>
            <IconClock size={11} />
            Expires {expiresAt.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
          </div>
        )}
        {expired && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: '#FEF2F2', borderRadius: 100,
            padding: '5px 12px',
            fontSize: 11, color: '#C0392B',
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600,
          }}>
            <IconAlert size={11} />
            Session ended
          </div>
        )}
      </header>

      {/* ── Expired banner ── */}
      {expired && (
        <div style={{
          background: '#FEF2F2',
          borderBottom: '1px solid rgba(192,57,43,0.12)',
          padding: '12px 20px',
          display: 'flex', alignItems: 'center', gap: 10,
          fontSize: 13, color: '#C0392B',
          fontFamily: "'Be Vietnam Pro', sans-serif",
        }}>
          <IconLock size={14} />
          This chatbot session has expired. You can no longer send messages.
        </div>
      )}

      {/* ── Messages ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 16px', paddingBottom: 100 }}>
        <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Empty state */}
          {messages.length === 0 && !isSending && !expired && (
            <div style={{ textAlign: 'center', padding: '60px 24px' }}>
              <div style={{
                width: 72, height: 72, borderRadius: 20,
                background: 'linear-gradient(135deg, #7B2CBF, #A66DD4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px', color: 'white',
                boxShadow: '0 8px 24px rgba(123,44,191,0.25)',
              }}>
                <IconPaw size={32} />
              </div>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 700, color: '#3A3A3A', margin: '0 0 8px' }}>
                Post-op Care Assistant
              </h3>
              <p style={{ color: '#6B6B6B', fontSize: 13, margin: '0 0 24px', lineHeight: 1.6 }}>
                Ask me anything about your pet's recovery after the procedure.
              </p>
              {/* Starter prompts */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  'What should I feed my pet after surgery?',
                  'When can my pet go back to normal activity?',
                  'What signs should I watch for?',
                ].map(prompt => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setInput(prompt)}
                    style={{
                      padding: '10px 16px',
                      background: '#fff',
                      border: '1px solid rgba(123,44,191,0.12)',
                      borderRadius: 10,
                      fontSize: 13, color: '#7B2CBF',
                      fontFamily: "'Be Vietnam Pro', sans-serif",
                      cursor: 'pointer', textAlign: 'left',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#F9F5FF')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.role === 'assistant' && (
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: 'linear-gradient(135deg, #7B2CBF, #A66DD4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', flexShrink: 0, marginRight: 8, marginTop: 4,
                }}>
                  <IconPaw size={12} />
                </div>
              )}
              <div style={{
                maxWidth: '72%',
                padding: '12px 16px',
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, #7B2CBF, #A66DD4)'
                  : '#fff',
                color: msg.role === 'user' ? '#fff' : '#3A3A3A',
                fontSize: 14, lineHeight: 1.55,
                fontFamily: "'Be Vietnam Pro', sans-serif",
                boxShadow: msg.role === 'user'
                  ? '0 4px 12px rgba(123,44,191,0.2)'
                  : '0 2px 12px rgba(97,0,164,0.06)',
              }}>
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isSending && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: 'linear-gradient(135deg, #7B2CBF, #A66DD4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', flexShrink: 0,
              }}>
                <IconPaw size={12} />
              </div>
              <div style={{
                background: '#fff', borderRadius: '16px 16px 16px 4px',
                padding: '14px 18px',
                boxShadow: '0 2px 12px rgba(97,0,164,0.06)',
                display: 'flex', gap: 5, alignItems: 'center',
              }}>
                {[0, 150, 300].map(delay => (
                  <span key={delay} style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: '#C4A8E8',
                    display: 'inline-block',
                    animation: `bounce 1s ${delay}ms infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Input ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(123,44,191,0.08)',
        padding: '12px 16px 16px',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', gap: 10 }}>
          <input
            ref={inputRef}
            value={input}
            disabled={expired}
            maxLength={2000}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder={expired ? 'Session expired — no more messages' : 'Ask about post-op care…'}
            style={{
              flex: 1,
              padding: '12px 16px',
              background: expired ? '#F5F5F7' : '#F5F5F7',
              border: '2px solid transparent',
              borderRadius: 12,
              fontSize: 14, color: '#3A3A3A',
              fontFamily: "'Be Vietnam Pro', sans-serif",
              outline: 'none',
              transition: 'all 0.18s',
              opacity: expired ? 0.5 : 1,
            }}
            onFocus={e => { if (!expired) e.target.style.border = '2px solid rgba(123,44,191,0.4)'; e.target.style.background = '#fff'; }}
            onBlur={e => { e.target.style.border = '2px solid transparent'; e.target.style.background = '#F5F5F7'; }}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || isSending || expired}
            style={{
              width: 44, height: 44,
              borderRadius: 12,
              background: (!input.trim() || isSending || expired)
                ? '#EDEDED'
                : 'linear-gradient(135deg, #7B2CBF, #A66DD4)',
              border: 'none', cursor: (!input.trim() || isSending || expired) ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: (!input.trim() || isSending || expired) ? '#A8A8A8' : 'white',
              flexShrink: 0,
              transition: 'all 0.18s',
              boxShadow: (!input.trim() || isSending || expired) ? 'none' : '0 4px 12px rgba(123,44,191,0.3)',
            }}
          >
            <IconSend size={16} />
          </button>
        </div>

        {!expired && (
          <p style={{
            textAlign: 'center', fontSize: 10, color: '#C0C0C0',
            fontFamily: "'Be Vietnam Pro', sans-serif", margin: '8px 0 0',
          }}>
            For emergencies, contact us at +63 927 867 8760
          </p>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}