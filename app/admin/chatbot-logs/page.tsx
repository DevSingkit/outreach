// app/admin/chatbot-logs/page.tsx
'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { supabase } from '@/lib/supabase-client';

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconPaw = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C10.34 2 9 3.34 9 5s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm-5 4C5.34 6 4 7.34 4 9s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm10 0c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM5.5 14C3.57 14 2 15.57 2 17.5S3.57 21 5.5 21c.96 0 1.83-.38 2.48-1H16c.65.62 1.52 1 2.48 1C20.43 21 22 19.43 22 17.5S20.43 14 18.48 14c-1.5 0-2.78.87-3.43 2.13C14.57 16.05 13.82 16 13 16h-2c-.82 0-1.57.05-2.05.13C8.3 14.87 7.02 14 5.5 14z" />
  </svg>
);
const IconMessage = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const IconChevronDown = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const IconChevronUp = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15" />
  </svg>
);
const IconUser = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const IconBot = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2" /><path d="M12 11V3" /><circle cx="12" cy="3" r="1" /><line x1="8" y1="15" x2="8" y2="15" /><line x1="16" y1="15" x2="16" y2="15" />
  </svg>
);
const IconKey = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
type Message = { role: string; content: string; created_at: string };
type Session = {
  session_id: string; owner_name: string; registration_id: string;
  session_token: string; expires_at: string;
  messages?: Message[];
};

export default function ChatbotLogsPage() {
    const { data: logs, isLoading } = useSWR('chatbot-logs', async () => {
    const { data } = await supabase
        .from('chatbot_sessions')
        .select('*, messages:chat_messages(*)');
      return data;
    }) as {
    data: Session[] | undefined; isLoading: boolean;
  };
  const [expanded, setExpanded] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#7B2CBF', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <IconPaw size={12} /> AI Chatbot
        </div>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, color: '#3A3A3A', margin: 0 }}>
          Chatbot Logs
        </h1>
        <p style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 14, color: '#6B6B6B', marginTop: 6 }}>
          Post-op AI chatbot sessions with pet owners
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
          <span style={{ width: 28, height: 28, border: '3px solid rgba(123,44,191,0.15)', borderTop: '3px solid #7B2CBF', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
        </div>
      )}

      {/* Empty */}
      {!isLoading && (!logs || logs.length === 0) && (
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#7B2CBF' }}>
            <IconMessage size={36} />
          </div>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 700, color: '#3A3A3A', marginBottom: 8 }}>No sessions yet</h3>
          <p style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 14, color: '#A8A8A8' }}>Chatbot sessions will appear here after owners use the post-op chatbot.</p>
        </div>
      )}

      {/* Sessions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {logs?.map(session => {
          const isOpen = expanded === session.session_id;
          const msgCount = session.messages?.length ?? 0;
          return (
            <div key={session.session_id} style={{
              background: '#FFFFFF', borderRadius: 20,
              boxShadow: isOpen ? '0 16px 40px rgba(123,44,191,0.10)' : hovered === session.session_id ? '0 12px 30px rgba(97,0,164,0.07)' : '0 8px 30px rgba(97,0,164,0.04)',
              border: '1px solid ' + (isOpen ? 'rgba(123,44,191,0.12)' : 'transparent'),
              overflow: 'hidden', transition: 'all 0.2s',
            }}
              onMouseEnter={() => setHovered(session.session_id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Session header (accordion trigger) */}
              <button
                onClick={() => setExpanded(isOpen ? null : session.session_id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '20px 28px', background: 'transparent', border: 'none', cursor: 'pointer',
                  textAlign: 'left', gap: 16,
                }}
              >
                {/* Left: avatar + info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 0 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, #7B2CBF, #A66DD4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                  }}>
                    <IconUser size={18} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 700, color: '#3A3A3A', marginBottom: 4 }}>
                      {session.owner_name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 12, color: '#A8A8A8' }}>
                        <IconKey size={11} />
                        {session.session_token.slice(0, 12)}…
                      </span>
                      <span style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 12, color: '#A8A8A8' }}>
                        Expires {new Date(session.expires_at).toLocaleDateString('en-PH', { dateStyle: 'medium' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: message count + chevron */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                  {msgCount > 0 && (
                    <span style={{
                      padding: '4px 12px', borderRadius: 100,
                      background: isOpen ? '#7B2CBF' : '#F3E8FF',
                      color: isOpen ? 'white' : '#7B2CBF',
                      fontSize: 12, fontWeight: 700,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      transition: 'all 0.2s',
                    }}>
                      {msgCount} msg{msgCount !== 1 ? 's' : ''}
                    </span>
                  )}
                  <span style={{ color: '#7B2CBF' }}>
                    {isOpen ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                  </span>
                </div>
              </button>

              {/* Conversation panel */}
              {isOpen && (
                <div style={{ borderTop: '1px solid rgba(123,44,191,0.08)', background: '#F9F4FF', padding: 24, maxHeight: 400, overflowY: 'auto' }}>
                  {!session.messages || session.messages.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#A8A8A8', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 14, padding: '24px 0' }}>
                      No messages in this session.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {session.messages.map((msg, i) => {
                        const isUser = msg.role === 'user';
                        return (
                          <div key={i} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
                            {/* Avatar for bot */}
                            {!isUser && (
                              <div style={{
                                width: 30, height: 30, borderRadius: '50%', flexShrink: 0, marginRight: 10, marginTop: 2,
                                background: 'linear-gradient(135deg, #7B2CBF, #A66DD4)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                              }}>
                                <IconBot size={14} />
                              </div>
                            )}
                            <div style={{
                              maxWidth: '70%', padding: '12px 16px', borderRadius: 16,
                              borderTopRightRadius: isUser ? 4 : 16,
                              borderTopLeftRadius: isUser ? 16 : 4,
                              background: isUser ? 'linear-gradient(135deg, #7B2CBF, #A66DD4)' : '#FFFFFF',
                              color: isUser ? 'white' : '#3A3A3A',
                              boxShadow: isUser ? '0 4px 16px rgba(123,44,191,0.25)' : '0 2px 12px rgba(97,0,164,0.06)',
                            }}>
                              <p style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 14, margin: 0, lineHeight: 1.6 }}>
                                {msg.content}
                              </p>
                              <p style={{
                                fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 10, marginTop: 6, marginBottom: 0,
                                color: isUser ? 'rgba(255,255,255,0.6)' : '#A8A8A8',
                              }}>
                                {new Date(msg.created_at).toLocaleTimeString('en-PH', { timeStyle: 'short' })}
                              </p>
                            </div>
                            {/* Avatar for user */}
                            {isUser && (
                              <div style={{
                                width: 30, height: 30, borderRadius: '50%', flexShrink: 0, marginLeft: 10, marginTop: 2,
                                background: '#E2D9F3',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7B2CBF',
                              }}>
                                <IconUser size={14} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}