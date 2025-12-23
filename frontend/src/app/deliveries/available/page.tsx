'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService, deliveryService } from '../../../lib/services';
import { Delivery } from '../../../types';

export default function AvailableDeliveriesPage() {
  const router = useRouter();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'VOLUNTEER') {
      router.push('/dashboard');
      return;
    }
    loadDeliveries();
  }, [router]);

  const loadDeliveries = async () => {
    try {
      const response = await deliveryService.getAvailable();
      setDeliveries(response.data);
    } catch (error) {
      console.error('Error loading deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id: number) => {
    try {
      await deliveryService.accept(id);
      router.push('/deliveries');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to accept delivery');
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
            <a href="/deliveries">My Deliveries</a>
            <a href="/deliveries/available">Browse Available</a>
            <button className="btn btn-danger" onClick={() => authService.logout()}>Logout</button>
          </div>
        </div>
      </div>

      <div className="container">
        <h2 style={{ fontSize: '28px', marginBottom: '30px' }}>Available Deliveries</h2>

        {deliveries.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h3 style={{ fontSize: '24px', color: '#999', marginBottom: '10px' }}>No deliveries available</h3>
            <p style={{ color: '#999' }}>Check back later for new delivery opportunities!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {deliveries.map((delivery) => (
              <div key={delivery.id} className="card" style={{ borderLeft: '4px solid #2ecc71' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>{delivery.donation?.foodType}</h3>
                    
                    <p style={{ color: '#666', marginBottom: '10px' }}>{delivery.donation?.description}</p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '14px', color: '#666' }}>
                      <div>
                        <strong>Quantity:</strong> {delivery.donation?.quantity} {delivery.donation?.unit}
                      </div>
                      <div>
                        <strong>Donor:</strong> {delivery.donation?.donor?.fullName}
                      </div>
                      <div>
                        <strong>Expiry:</strong> {new Date(delivery.donation?.expiryDate || '').toLocaleString()}
                      </div>
                    </div>

                    {delivery.donation?.pickupAddress && (
                      <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0f8ff', borderRadius: '5px' }}>
                        <strong style={{ fontSize: '14px' }}>📍 Pickup Address:</strong>
                        <p style={{ fontSize: '14px', color: '#666', margin: '5px 0 0 0' }}>
                          {delivery.donation.pickupAddress}
                        </p>
                      </div>
                    )}

                    {delivery.donation?.specialInstructions && (
                      <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#fff8dc', borderRadius: '5px' }}>
                        <strong style={{ fontSize: '14px' }}>⚠️ Special Instructions:</strong>
                        <p style={{ fontSize: '14px', color: '#666', margin: '5px 0 0 0' }}>
                          {delivery.donation.specialInstructions}
                        </p>
                      </div>
                    )}

                    <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '5px' }}>
                      <p style={{ fontSize: '14px', color: '#2e7d32', margin: 0 }}>
                        ⭐ You'll earn <strong>15 points</strong> for completing this delivery!
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ marginLeft: '20px' }}>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => handleAccept(delivery.id)}
                      style={{ fontSize: '14px', padding: '8px 16px' }}
                    >
                      Accept Delivery
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
