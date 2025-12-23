'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService, userService } from '../../lib/services';
import { User } from '../../types';

export default function AdminPage() {
  const router = useRouter();
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
    loadPendingUsers();
  }, [router]);

  const loadPendingUsers = async () => {
    try {
      const response = await userService.getPending();
      setPendingUsers(response.data);
    } catch (error) {
      console.error('Error loading pending users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await userService.approve(id);
      loadPendingUsers();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to approve user');
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm('Are you sure you want to reject this user?')) return;
    
    try {
      await userService.reject(id);
      loadPendingUsers();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to reject user');
    }
  };

  if (loading) {
    return (
      <div>
        <div className="header">
          <div className="header-content">
            <h1 style={{ fontSize: '24px', color: '#2ecc71' }}>🍱 KheirBox</h1>
          </div>
        </div>
        <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="header">
        <div className="header-content">
          <h1 style={{ fontSize: '24px', color: '#2ecc71' }}>🍱 KheirBox</h1>
          <div className="nav">
            <a href="/dashboard">Dashboard</a>
            <a href="/admin">Admin Panel</a>
            <button className="btn btn-danger" onClick={() => authService.logout()}>Logout</button>
          </div>
        </div>
      </div>

      <div className="container">
        <h2 style={{ fontSize: '28px', marginBottom: '30px' }}>Admin Panel</h2>

        <div className="card">
          <h3 style={{ fontSize: '20px', marginBottom: '20px' }}>Pending User Approvals</h3>
          
          {pendingUsers.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
              No pending user approvals
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ddd' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Role</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Organization</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Phone</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingUsers.map((user) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px' }}>{user.fullName}</td>
                      <td style={{ padding: '12px' }}>{user.email}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          backgroundColor: '#3498db', 
                          color: 'white', 
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>{user.organizationName || '-'}</td>
                      <td style={{ padding: '12px' }}>{user.phoneNumber || '-'}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                          <button 
                            className="btn btn-primary" 
                            onClick={() => handleApprove(user.id)}
                            style={{ fontSize: '12px', padding: '6px 12px' }}
                          >
                            Approve
                          </button>
                          <button 
                            className="btn btn-danger" 
                            onClick={() => handleReject(user.id)}
                            style={{ fontSize: '12px', padding: '6px 12px' }}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
