'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { donationService } from '../../../lib/services';

export default function CreateDonationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    foodType: '',
    description: '',
    quantity: '',
    unit: 'kg',
    expiryDate: '',
    pickupAddress: '',
    specialInstructions: '',
    isRecurring: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await donationService.create({
        ...formData,
        quantity: parseInt(formData.quantity),
        expiryDate: new Date(formData.expiryDate).toISOString(),
      });
      router.push('/donations');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="header">
        <div className="header-content">
          <h1 style={{ fontSize: '24px', color: '#2ecc71' }}>🍱 KheirBox</h1>
          <div className="nav">
            <a href="/dashboard">Dashboard</a>
            <a href="/donations">My Donations</a>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '800px' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '20px' }}>Create New Donation</h2>

        {error && (
          <div className="card" style={{ backgroundColor: '#fee', borderLeft: '4px solid #c00', marginBottom: '20px' }}>
            <p style={{ color: '#c00' }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card">
          <div className="form-group">
            <label>Food Type *</label>
            <input
              type="text"
              name="foodType"
              value={formData.foodType}
              onChange={handleChange}
              required
              placeholder="e.g., Fresh Vegetables, Cooked Rice, Bread"
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Describe the food items in detail"
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label>Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="1"
                placeholder="Enter quantity"
              />
            </div>

            <div className="form-group">
              <label>Unit *</label>
              <select name="unit" value={formData.unit} onChange={handleChange} required>
                <option value="kg">Kilograms</option>
                <option value="liters">Liters</option>
                <option value="servings">Servings</option>
                <option value="pieces">Pieces</option>
                <option value="boxes">Boxes</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Expiry Date & Time *</label>
            <input
              type="datetime-local"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Pickup Address</label>
            <input
              type="text"
              name="pickupAddress"
              value={formData.pickupAddress}
              onChange={handleChange}
              placeholder="Leave empty to use your profile address"
            />
          </div>

          <div className="form-group">
            <label>Special Instructions</label>
            <textarea
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleChange}
              rows={3}
              placeholder="Any special handling instructions, storage requirements, etc."
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="isRecurring"
                checked={formData.isRecurring}
                onChange={handleChange}
                style={{ width: 'auto', marginRight: '10px' }}
              />
              This is a recurring donation
            </label>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Donation'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => router.push('/donations')}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
