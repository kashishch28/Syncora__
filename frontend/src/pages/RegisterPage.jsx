import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Music2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await register(form.username, form.email, form.password); navigate('/home'); }
    catch (err) { setError(err.response?.data?.error || 'Registration failed.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020408', padding: '24px', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <div style={{ position: 'absolute', top: '-60px', left: '30%', width: 300, height: 300, borderRadius: '50%', background: 'linear-gradient(135deg,#06b6d4,#8b5cf6)', filter: 'blur(90px)', opacity: 0.1 }} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 28 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#06b6d4,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(6,182,212,0.4)' }}>
            <Music2 size={15} color="white" />
          </div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: 22, background: 'linear-gradient(135deg,#e0f2fe,#c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Syncora</span>
        </div>
        <div style={{ background: 'rgba(2,6,20,0.9)', backdropFilter: 'blur(24px)', border: '1px solid rgba(6,182,212,0.15)', borderRadius: 20, padding: '32px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(6,182,212,0.4),transparent)' }} />
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 900, background: 'linear-gradient(135deg,#e0f2fe,#c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 6 }}>Create account</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginBottom: 22 }}>Join Syncora — your mood, your music.</p>

          {error && (
            <div style={{ padding: '10px 14px', borderRadius: 10, marginBottom: 14, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <p style={{ color: '#fca5a5', fontSize: 13 }}>{error}</p>
            </div>
          )}

          <form onSubmit={submit}>
            {[['Username', 'username', 'yourname', 'text', 3], ['Email', 'email', 'you@example.com', 'email', null]].map(([lbl, key, ph, type, min]) => (
              <div key={key} style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'rgba(6,182,212,0.6)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 5 }}>{lbl}</label>
                <input type={type} placeholder={ph} value={form[key]} minLength={min}
                  onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} required
                  style={{ width: '100%', padding: '10px 13px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(6,182,212,0.14)', borderRadius: 9, color: '#e0f2fe', fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(6,182,212,0.14)'} />
              </div>
            ))}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: 'rgba(6,182,212,0.6)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 5 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters" value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required minLength={6}
                  style={{ width: '100%', padding: '10px 40px 10px 13px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(6,182,212,0.14)', borderRadius: 9, color: '#e0f2fe', fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(6,182,212,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(6,182,212,0.14)'} />
                <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)' }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#06b6d4,#8b5cf6)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 0 20px rgba(6,182,212,0.3)' }}>
              {loading ? <div style={{ width: 18, height: 18, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : 'Create Account →'}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#67e8f9', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
          </div>
        </div>
      </motion.div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
