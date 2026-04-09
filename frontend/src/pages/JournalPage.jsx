import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Save, Edit3, Trash2 } from 'lucide-react';
import CryptoJS from 'crypto-js';

const STORAGE_KEY = 'syncora_journal_v1';

const DEFAULT_NOTES = [
  { id: 'n1', title: 'My Intentions for the Week', content: '1. Focus on deep work in the mornings.\n2. Dedicate 20 mins to calm ambient music listening before sleep.\n3. Drink more water!', date: Date.now() - 86400000 * 2, encrypted: true },
  { id: 'n2', title: 'Why I love Syncora', content: 'This platform makes me feel like I am in a sci-fi movie. The mood tracking perfectly aligns with my flow states.', date: Date.now() - 86400000, encrypted: true }
];

export default function JournalPage() {
  const [locked, setLocked] = useState(true);
  const [passcode, setPasscode] = useState('');
  const [secretKey, setSecretKey] = useState(null);
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    // Only load if unlocked
    if (!locked && secretKey) {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          const decryptedNotes = JSON.parse(raw).map(n => {
            // Decrypt the content and title if necessary
            const t = CryptoJS.AES.decrypt(n.title, secretKey).toString(CryptoJS.enc.Utf8);
            const c = CryptoJS.AES.decrypt(n.content, secretKey).toString(CryptoJS.enc.Utf8);
            return { ...n, title: t || n.title, content: c || n.content };
          });
          setNotes(decryptedNotes);
        } catch(e) {
          console.error("Wrong password or corrupted data");
          // Re-lock if decryption fails drastically (wrong password)
          setLocked(true);
        }
      } else {
        // Seed initial notes
        setNotes(DEFAULT_NOTES);
        saveNotesSecurely(DEFAULT_NOTES, secretKey);
      }
    }
  }, [locked, secretKey]);

  const saveNotesSecurely = (notesToSave, key) => {
    const encrypted = notesToSave.map(n => ({
      ...n,
      title: CryptoJS.AES.encrypt(n.title, key).toString(),
      content: CryptoJS.AES.encrypt(n.content, key).toString()
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(encrypted));
  };

  const handleUnlock = (e) => {
    e.preventDefault();
    if (passcode.length < 4) return;
    setSecretKey(passcode);
    setLocked(false);
  };

  const saveNote = () => {
    const updated = activeNote
      ? notes.map(n => n.id === activeNote.id ? { ...n, title, content, date: Date.now() } : n)
      : [{ id: Date.now().toString(), title, content, date: Date.now() }, ...notes];
    
    setNotes(updated);
    saveNotesSecurely(updated, secretKey);
    setEditing(false);
    setActiveNote(null);
  };

  const deleteNote = (id) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    saveNotesSecurely(updated, secretKey);
    if (activeNote?.id === id) setActiveNote(null);
  };

  if (locked) {
    return (
      <div className="flex flex-col items-center justify-center p-8" style={{ minHeight: 'calc(100vh - 140px)' }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card max-w-sm w-full p-8 text-center" style={{ background: 'rgba(2,5,15,0.8)' }}>
          <Lock size={48} className="mx-auto mb-6 text-cyan-400" />
          <h2 className="text-2xl font-black mb-2 tracking-tight text-white font-[Playfair_Display]">Secure Journal</h2>
          <p className="text-xs text-white/40 mb-6 px-4">End-to-End Encrypted using AES. We never store your passcode. If lost, your notes are unrecoverable.</p>
          
          <form onSubmit={handleUnlock}>
            <input 
              type="password" 
              placeholder="Enter Master Passcode" 
              value={passcode}
              onChange={e => setPasscode(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white text-center text-lg focus:border-cyan-400 outline-none mb-4 transition-colors"
            />
            <button type="submit" className="w-full py-3 rounded-lg font-bold text-black" style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)' }}>
              Unlock Vault
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (editing || activeNote) {
    return (
      <div className="p-8 max-w-3xl glass-panel min-h-[calc(100vh-140px)] rounded-r-2xl m-4">
        <div className="flex items-center justify-between mb-6">
            <button onClick={() => { setEditing(false); setActiveNote(null); }} className="text-cyan-400 text-sm font-bold flex items-center gap-2 hover:text-white transition-colors">
                ← Back to Vault
            </button>
            <div className="flex items-center gap-2">
                {activeNote && !editing && (
                    <button onClick={() => { setEditing(true); setTitle(activeNote.title); setContent(activeNote.content); }} className="p-2 rounded-full bg-white/5 text-white/50 hover:text-white"><Edit3 size={16}/></button>
                )}
                {activeNote && (
                    <button onClick={() => deleteNote(activeNote.id)} className="p-2 rounded-full bg-white/5 text-white/50 hover:text-red-400"><Trash2 size={16}/></button>
                )}
                {editing && (
                    <button onClick={saveNote} className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-black font-bold px-4 py-2 rounded-full text-sm">
                        <Save size={14}/> Save Securely
                    </button>
                )}
            </div>
        </div>

        {editing ? (
            <div className="flex flex-col gap-4">
                <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Note Title..." className="bg-transparent border-none outline-none text-2xl font-bold text-white placeholder-white/20 font-[Playfair_Display]" />
                <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Type your encrypted thoughts..." className="bg-transparent border-none outline-none text-white/70 min-h-[500px] resize-none leading-relaxed" spellCheck={false} />
            </div>
        ) : (
            <div>
                <h1 className="text-3xl font-black text-white mb-6 font-[Playfair_Display]">{activeNote.title}</h1>
                <div className="whitespace-pre-wrap text-white/70 leading-relaxed">{activeNote.content}</div>
            </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl">
        <div className="flex items-center justify-between mb-10">
            <div>
                <h1 className="text-3xl font-black text-white font-[Playfair_Display] flex items-center gap-3">
                    <Unlock className="text-cyan-400" size={28}/> E2EE Vault
                </h1>
                <p className="text-xs text-cyan-400/50 mt-1 uppercase tracking-widest">AES-256 Client-Side Encryption Active</p>
            </div>
            <div className="flex gap-4">
                <button onClick={() => { setLocked(true); setPasscode(''); setSecretKey(''); setNotes([]); }} className="text-xs text-white/40 hover:text-white border border-white/10 px-4 py-2 rounded-full flex items-center gap-2">
                    <Lock size={12}/> Lock Vault
                </button>
                <button onClick={() => { setEditing(true); setTitle(''); setContent(''); }} className="bg-white text-black font-bold px-5 py-2 rounded-full text-sm flex items-center gap-2 hover:scale-105 transition-transform">
                    <Edit3 size={16}/> New Note
                </button>
            </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <AnimatePresence>
                {notes.map(note => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        key={note.id} 
                        onClick={() => setActiveNote(note)}
                        className="glass-card p-5 cursor-pointer hover:border-cyan-400/30 group transition-all h-[180px] flex flex-col"
                        style={{ background: 'rgba(10,15,25,0.7)' }}
                    >
                        <h3 className="font-bold text-white mb-2 line-clamp-2 leading-snug">{note.title || 'Untitled Note'}</h3>
                        <p className="text-xs text-white/40 line-clamp-3 mb-auto">{note.content}</p>
                        <div className="mt-4 flex items-center justify-between text-[10px] text-white/30 border-t border-white/5 pt-3">
                            <span>{new Date(note.date).toLocaleDateString()}</span>
                            <Lock size={10} className="text-cyan-400/50 group-hover:text-cyan-400 transition-colors" />
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
        {notes.length === 0 && (
             <div className="text-center py-20 opacity-50">
                <Edit3 size={48} className="mx-auto mb-4" />
                <p>Your vault is empty</p>
             </div>
        )}
    </div>
  );
}
