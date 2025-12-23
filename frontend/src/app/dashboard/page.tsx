'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService, userService, donationService, deliveryService, notificationService } from '../../lib/services';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [donations, setDonations] = useState<any[]>([]);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      const [statsRes, notifRes] = await Promise.all([
        userService.getStats(),
        notificationService.getAll(),
      ]);
      setStats(statsRes.data);
      setNotifications(notifRes.data.slice(0, 5));

      const currentUser = authService.getCurrentUser();
      if (currentUser.role === 'DONOR') {
        const donRes = await donationService.getMy();
        setDonations(donRes.data);
      } else if (currentUser.role === 'VOLUNTEER') {
        const delRes = await deliveryService.getMy();
        setDeliveries(delRes.data);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
  };

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>Loading...</div>;
  }

  return (
    <div>
      <div className="header">
        <div className="header-content">
          <h1 style={{ fontSize: '24px', color: '#2ecc71' }}>🍱 KheirBox</h1>
          <div className="nav">
            <a href="/dashboard">Dashboard</a>
            {user?.role === 'DONOR' && <a href="/donations">My Donations</a>}
            {user?.role === 'VOLUNTEER' && <a href="/deliveries">My Deliveries</a>}
            {user?.role === 'ADMIN' && <a href="/admin">Admin Panel</a>}
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>

      <div className="container">
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '10px' }}>
            Welcome, {user?.fullName}!
          </h2>
          <p style={{ color: '#666', fontSize: '16px' }}>
            Role: <strong>{user?.role}</strong> | Status: <strong>{user?.status}</strong>
          </p>
        </div>

        {user?.status === 'PENDING' && (
          <div className="card" style={{ backgroundColor: '#fff3cd', borderLeft: '4px solid #ffc107' }}>
            <h3 style={{ marginBottom: '10px' }}>⏳ Account Pending Approval</h3>
            <p style={{ color: '#666' }}>
              Your account is currently pending approval. You will receive a notification once it's activated.
            </p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <h3 style={{ fontSize: '40px', marginBottom: '10px' }}>{stats?.points || 0}</h3>
            <p>Points Earned</p>
          </div>
          <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <h3 style={{ fontSize: '40px', marginBottom: '10px' }}>{stats?.donationsCount || 0}</h3>
            <p>Donations Made</p>
          </div>
          <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <h3 style={{ fontSize: '40px', marginBottom: '10px' }}>{stats?.deliveriesCount || 0}</h3>
            <p>Deliveries Completed</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '20px', marginBottom: '15px' }}>Recent Notifications</h3>
            {notifications.length === 0 ? (
              <div className="card">
                <p style={{ color: '#999', textAlign: 'center' }}>No notifications</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className="card" style={{ borderLeft: `4px solid ${notif.isRead ? '#ddd' : '#2ecc71'}` }}>
                  <h4 style={{ marginBottom: '5px' }}>{notif.title}</h4>
                  <p style={{ color: '#666', fontSize: '14px' }}>{notif.message}</p>
                  <p style={{ color: '#999', fontSize: '12px', marginTop: '5px' }}>
                    {new Date(notif.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>

          {user?.role === 'DONOR' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ fontSize: '20px' }}>Recent Donations</h3>
                <a href="/donations/create" className="btn btn-primary">+ Create Donation</a>
              </div>
              {donations.length === 0 ? (
                <div className="card">
                  <p style={{ color: '#999', textAlign: 'center' }}>No donations yet</p>
                </div>
              ) : (
                donations.slice(0, 3).map((donation) => (
                  <div key={donation.id} className="card">
                    <h4>{donation.foodType}</h4>
                    <p style={{ color: '#666', fontSize: '14px', margin: '5px 0' }}>{donation.description}</p>
                    <p style={{ fontSize: '14px' }}>
                      Quantity: {donation.quantity} {donation.unit} | Status: <strong>{donation.status}</strong>
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {user?.role === 'VOLUNTEER' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ fontSize: '20px' }}>My Deliveries</h3>
                <a href="/deliveries/available" className="btn btn-primary">Browse Available</a>
              </div>
              {deliveries.length === 0 ? (
                <div className="card">
                  <p style={{ color: '#999', textAlign: 'center' }}>No deliveries yet</p>
                </div>
              ) : (
                deliveries.slice(0, 3).map((delivery) => (
                  <div key={delivery.id} className="card">
                    <h4>{delivery.donation?.foodType}</h4>
                    <p style={{ color: '#666', fontSize: '14px', margin: '5px 0' }}>
                      {delivery.donation?.description}
                    </p>
                    <p style={{ fontSize: '14px' }}>Status: <strong>{delivery.status}</strong></p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
