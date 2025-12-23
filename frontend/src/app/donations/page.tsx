'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService, donationService } from '../../lib/services';
import { Donation } from '../../types';

export default function DonationsPage() {
  const router = useRouter();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'DONOR') {
      router.push('/dashboard');
      return;
    }
    loadDonations();
  }, [router]);

  const loadDonations = async () => {
    try {
      const response = await donationService.getMy();
      setDonations(response.data);
    } catch (error) {
      console.error('Error loading donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this donation?')) return;
    
    try {
      await donationService.cancel(id);
      loadDonations();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to cancel donation');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return '#ffa500';
      case 'MATCHED': return '#3498db';
      case 'IN_TRANSIT': return '#9b59b6';
      case 'COMPLETED': return '#2ecc71';
      case 'CANCELLED': return '#e74c3c';
      default: return '#95a5a6';
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
            <a href="/donations">My Donations</a>
            <button className="btn btn-danger" onClick={() => authService.logout()}>Logout</button>
          </div>
        </div>
      </div>

      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '28px' }}>My Donations</h2>
          <a href="/donations/create" className="btn btn-primary">+ Create Donation</a>
        </div>

        {donations.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h3 style={{ fontSize: '24px', color: '#999', marginBottom: '10px' }}>No donations yet</h3>
            <p style={{ color: '#999', marginBottom: '20px' }}>Create your first donation to help reduce food waste!</p>
            <a href="/donations/create" className="btn btn-primary">Create Donation</a>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {donations.map((donation) => (
              <div key={donation.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <h3 style={{ fontSize: '20px', margin: 0 }}>{donation.foodType}</h3>
                      <span 
                        style={{ 
                          padding: '4px 12px', 
                          borderRadius: '12px', 
                          fontSize: '12px',
                          fontWeight: 'bold',
                          color: 'white',
                          backgroundColor: getStatusColor(donation.status)
                        }}
                      >
                        {donation.status}
                      </span>
                    </div>
                    
                    <p style={{ color: '#666', marginBottom: '10px' }}>{donation.description}</p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '14px', color: '#666' }}>
                      <div>
                        <strong>Quantity:</strong> {donation.quantity} {donation.unit}
                      </div>
                      <div>
                        <strong>Expiry:</strong> {new Date(donation.expiryDate).toLocaleString()}
                      </div>
                      <div>
                        <strong>Created:</strong> {new Date(donation.createdAt).toLocaleDateString()}
                      </div>
                      {donation.pickupAddress && (
                        <div>
                          <strong>Pickup:</strong> {donation.pickupAddress}
                        </div>
                      )}
                    </div>
                    
                    {donation.specialInstructions && (
                      <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
                        <strong style={{ fontSize: '14px' }}>Special Instructions:</strong>
                        <p style={{ fontSize: '14px', color: '#666', margin: '5px 0 0 0' }}>
                          {donation.specialInstructions}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {donation.status === 'PENDING' && (
                    <div style={{ marginLeft: '20px' }}>
                      <button 
                        className="btn btn-danger" 
                        onClick={() => handleCancel(donation.id)}
                        style={{ fontSize: '14px', padding: '8px 16px' }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
