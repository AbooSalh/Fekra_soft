'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService, deliveryService } from '../../lib/services';
import { Delivery } from '../../types';

export default function MyDeliveriesPage() {
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
      const response = await deliveryService.getMy();
      setDeliveries(response.data);
    } catch (error) {
      console.error('Error loading deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await deliveryService.updateStatus(id, status);
      loadDeliveries();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return '#ffa500';
      case 'ACCEPTED': return '#3498db';
      case 'PICKED_UP': return '#9b59b6';
      case 'IN_TRANSIT': return '#9b59b6';
      case 'DELIVERED': return '#2ecc71';
      case 'CANCELLED': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getNextAction = (status: string) => {
    switch (status) {
      case 'ACCEPTED': return { label: 'Mark as Picked Up', nextStatus: 'PICKED_UP' };
      case 'PICKED_UP': return { label: 'Mark as In Transit', nextStatus: 'IN_TRANSIT' };
      case 'IN_TRANSIT': return { label: 'Mark as Delivered', nextStatus: 'DELIVERED' };
      default: return null;
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
        <h2 style={{ fontSize: '28px', marginBottom: '30px' }}>My Deliveries</h2>

        {deliveries.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h3 style={{ fontSize: '24px', color: '#999', marginBottom: '10px' }}>No deliveries yet</h3>
            <p style={{ color: '#999', marginBottom: '20px' }}>Browse available deliveries to start helping!</p>
            <a href="/deliveries/available" className="btn btn-primary">Browse Available Deliveries</a>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {deliveries.map((delivery) => {
              const nextAction = getNextAction(delivery.status);
              return (
                <div key={delivery.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <h3 style={{ fontSize: '20px', margin: 0 }}>{delivery.donation?.foodType}</h3>
                        <span 
                          style={{ 
                            padding: '4px 12px', 
                            borderRadius: '12px', 
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: 'white',
                            backgroundColor: getStatusColor(delivery.status)
                          }}
                        >
                          {delivery.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <p style={{ color: '#666', marginBottom: '10px' }}>{delivery.donation?.description}</p>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '14px', color: '#666' }}>
                        <div>
                          <strong>Quantity:</strong> {delivery.donation?.quantity} {delivery.donation?.unit}
                        </div>
                        <div>
                          <strong>Donor:</strong> {delivery.donation?.donor?.fullName}
                        </div>
                        {delivery.pickupTime && (
                          <div>
                            <strong>Picked Up:</strong> {new Date(delivery.pickupTime).toLocaleString()}
                          </div>
                        )}
                        {delivery.deliveryTime && (
                          <div>
                            <strong>Delivered:</strong> {new Date(delivery.deliveryTime).toLocaleString()}
                          </div>
                        )}
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
                    </div>
                    
                    {nextAction && (
                      <div style={{ marginLeft: '20px' }}>
                        <button 
                          className="btn btn-primary" 
                          onClick={() => handleUpdateStatus(delivery.id, nextAction.nextStatus)}
                          style={{ fontSize: '14px', padding: '8px 16px' }}
                        >
                          {nextAction.label}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
