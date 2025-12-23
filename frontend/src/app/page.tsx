'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', color: '#2ecc71', marginBottom: '20px' }}>
          🍱 KheirBox
        </h1>
        <p style={{ fontSize: '20px', color: '#666' }}>
          Food Donation Platform
        </p>
        <p style={{ marginTop: '20px', color: '#999' }}>Loading...</p>
      </div>
    </div>
  );
}
