'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminControlLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/adminControl/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        router.push('/adminControl/dashboard');
      } else {
        const data = await res.json();
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--black)', color: 'var(--ivory)' }}>
      <form onSubmit={handleLogin} style={{ width: '400px', padding: '48px', backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', marginBottom: '8px', color: 'var(--gold)' }}>Zevro Control</h1>
        <p style={{ marginBottom: '32px', color: '#888', fontSize: '14px' }}>Operator console login</p>
        
        {error && <div style={{ color: 'red', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', color: '#ccc' }}>USERNAME</label>
          <input required type="text" value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: '12px', backgroundColor: '#333', border: '1px solid #444', color: '#fff', outline: 'none' }} />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', color: '#ccc' }}>PASSWORD</label>
          <input required type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', backgroundColor: '#333', border: '1px solid #444', color: '#fff', outline: 'none' }} />
        </div>

        <button type="submit" style={{ width: '100%', padding: '16px', backgroundColor: 'var(--gold)', color: 'var(--black)', border: 'none', fontWeight: 600, cursor: 'pointer' }}>LOGIN</button>
      </form>
    </div>
  );
}
