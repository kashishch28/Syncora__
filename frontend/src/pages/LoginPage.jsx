import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Music2, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await login(form.email, form.password); navigate('/home'); }
    catch (err) { setError(err.response?.data?.error || 'Invalid credentials. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#020408', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* Left */}
      <div style={{ display: 'none', flex: '0 0 46%', flexDirection: 'column', justifyContent: 'space-between', padding: '40px', background: 'rgba(2,6,18,0.95)', borderRight: '1px solid rgba(6,182,212,0.08)', position: 'relative', overflow: 'hidden' }} className="auth-left">
        <div style={{ position: 'absolute', top: '-60px', right: '-40px', width: 300, height: 300, borderRadius: '50%', background: 'linear-gradient(135deg,#06b6d4,#8b5cf6)', filter: 'blur(80px)', opacity: 0.12 }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '-20px', width: 250, height: 250, borderRadius: '50%', background: '#8b5cf6', filter: 'blur(80px)', opacity: 0.08 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative', zIndex: 1 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#06b6d4,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Music2 size={16} color="white" />
          </div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: 20, background: 'linear-gradient(135deg,#e0f2fe,#c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Syncora</span>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: 'Playfair Display, serif', fontSize: 44, fontWeight: 900, color: '#e0f2fe', lineHeight: 1.1, marginBottom: 18 }}>
            Music that<br />moves with<br /><span style={{ background: 'linear-gradient(135deg,#06b6d4,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>your mood.</span>
          </motion.h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: 340 }}>
            Mood intelligence, encrypted journal, real-time music discovery and AI insights — all in one cinematic experience.
          </p>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', position: 'relative', zIndex: 1 }}>© 2025 Syncora</p>
      </div>

      {/* Right */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 32 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#06b6d4,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(6,182,212,0.4)' }}>
              <Music2 size={15} color="white" />
            </div>
            <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: 22, background: 'linear-gradient(135deg,#e0f2fe,#c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Syncora</span>
          </div>

          <div style={{ background: 'rgba(2,6,20,0.9)', backdropFilter: 'blur(24px)', border: '1px solid rgba(6,182,212,0.15)', borderRadius: 20, padding: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(6,182,212,0.4),transparent)' }} />
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 900, background: 'linear-gradient(135deg,#e0f2fe,#c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 6 }}>Welcome back</h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginBottom: 24 }}>Sign in to your Syncora account</p>

            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                style={{ padding: '10px 14px', borderRadius: 10, marginBottom: 16, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                <p style={{ color: '#fca5a5', fontSize: 13 }}>{error}</p>
              </motion.div>
            )}

            <form onSubmit={submit}>
              {[['Email', 'email', 'you@example.com', 'email'], ['Password', 'password', '••••••••', showPw ? 'text' : 'password']].map(([lbl, key, ph, type]) => (
                <div key={key} style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'rgba(6,182,212,0.6)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6 }}>{lbl}</label>
                  <div style={{ position: 'relative' }}>
                    <input type={type} placeholder={ph} value={form[key]}
                      onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} required
                      style={{ width: '100%', padding: '11px 14px', paddingRight: key === 'password' ? 42 : 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(6,182,212,0.14)', borderRadius: 10, color: '#e0f2fe', fontSize: 13, outline: 'none', fontFamily: 'inherit', transition: 'border-color .2s' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.5)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(6,182,212,0.14)'} />
                    {key === 'password' && (
                      <button type="button" onClick={() => setShowPw(p => !p)}
                        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)' }}>
                        {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button type="submit" disabled={loading}
                style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#06b6d4,#8b5cf6)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', marginTop: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 0 20px rgba(6,182,212,0.3)' }}>
                {loading ? <div style={{ width: 18, height: 18, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : <><Zap size={15} /> Sign In</>}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#67e8f9', fontWeight: 700, textDecoration: 'none' }}>Create one</Link>
            </div>
          </div>
        </motion.div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
