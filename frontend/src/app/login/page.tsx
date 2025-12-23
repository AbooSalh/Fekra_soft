'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../lib/services';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <h1 style={{ fontSize: '32px', color: '#2ecc71', marginBottom: '10px', textAlign: 'center' }}>
          🍱 KheirBox
        </h1>
        <h2 style={{ fontSize: '24px', marginBottom: '30px', textAlign: 'center', color: '#666' }}>
          Login
        </h2>
        
        {error && (
          <div style={{ 
            padding: '10px', 
            backgroundColor: '#fee', 
            color: '#c00', 
            borderRadius: '5px', 
            marginBottom: '20px' 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>
          Don't have an account?{' '}
          <a 
            href="/register" 
            style={{ color: '#2ecc71', fontWeight: '500' }}
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
