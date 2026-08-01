import React, { useState } from 'react';
import './Donation.css';

// ===========================
// Dummy Donation Centers
// ===========================
const dummyCenters = [
  {
    id: 1,
    name: 'City NGO Pune',
    type: 'NGO',
    address: '123 NGO Street, Pune',
    phone: '9876543210',
    contactPerson: 'Rahul Sharma',
    active: true
  },
  {
    id: 2,
    name: 'Sunshine Orphanage',
    type: 'ORPHANAGE',
    address: '456 Children Street, Pune',
    phone: '9876543211',
    contactPerson: 'Priya Singh',
    active: true
  },
  {
    id: 3,
    name: 'Old Age Home Pune',
    type: 'OLD_AGE_HOME',
    address: '789 Elder Road, Pune',
    phone: '9876543212',
    contactPerson: 'Amit Kumar',
    active: true
  },
  {
    id: 4,
    name: 'Shelter Home Mumbai',
    type: 'SHELTER_HOME',
    address: '321 Shelter Lane, Mumbai',
    phone: '9876543213',
    contactPerson: 'Sneha Patil',
    active: true
  },
  {
    id: 5,
    name: 'Needy People Fund',
    type: 'NEEDY_PEOPLE',
    address: '654 Help Road, Nashik',
    phone: '9876543214',
    contactPerson: 'Vijay More',
    active: true
  }
];

// ===========================
// Center Type Helpers
// ===========================
const getCenterEmoji = (type) => {
  switch(type) {
    case 'NGO': return '🏛️';
    case 'ORPHANAGE': return '👶';
    case 'OLD_AGE_HOME': return '👴';
    case 'SHELTER_HOME': return '🏠';
    case 'NEEDY_PEOPLE': return '👨‍👩‍👧';
    default: return '🤝';
  }
};

const getCenterBadgeClass = (type) => {
  switch(type) {
    case 'NGO': return 'type-ngo';
    case 'ORPHANAGE': return 'type-orphanage';
    case 'OLD_AGE_HOME': return 'type-old-age';
    case 'SHELTER_HOME': return 'type-shelter';
    case 'NEEDY_PEOPLE': return 'type-needy';
    default: return 'type-ngo';
  }
};

const formatType = (type) => {
  switch(type) {
    case 'NGO': return 'NGO';
    case 'ORPHANAGE': return 'Orphanage';
    case 'OLD_AGE_HOME': return 'Old Age Home';
    case 'SHELTER_HOME': return 'Shelter Home';
    case 'NEEDY_PEOPLE': return 'Needy People';
    default: return type;
  }
};

const DonationPage = () => {

  const [selectedCenter, setSelectedCenter] =
    useState(null);
  const [activeFilter, setActiveFilter] =
    useState('All');
  const [donated, setDonated] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirmDonation = () => {
    if (!selectedCenter) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDonated(true);
    }, 1500);
  };

  const filteredCenters =
    activeFilter === 'All'
      ? dummyCenters
      : dummyCenters.filter(c =>
          c.type === activeFilter);

  return (
    <div className="donation-page">

      {/* Header */}
      <div className="donation-header">
        <div className="donation-header-emoji">
          🙏
        </div>
        <h1 className="donation-header-title">
          Donate Surplus Food
        </h1>
        <p className="donation-header-subtitle">
          Connect unsold food with those who
          need it most! Every meal matters. 💚
        </p>
      </div>

      <div className="donation-container">

        {/* Impact Stats */}
        <div className="impact-section">
          <h3 className="impact-title">
            🌍 Our Donation Impact
          </h3>
          <div className="impact-grid">
            <div className="impact-item">
              <div className="impact-item-emoji">
                🍱
              </div>
              <div className="impact-item-number">
                200+
              </div>
              <div className="impact-item-label">
                Meals Donated
              </div>
            </div>
            <div className="impact-item">
              <div className="impact-item-emoji">
                🏛️
              </div>
              <div className="impact-item-number">
                5+
              </div>
              <div className="impact-item-label">
                NGO Partners
              </div>
            </div>
            <div className="impact-item">
              <div className="impact-item-emoji">
                👶
              </div>
              <div className="impact-item-number">
                100+
              </div>
              <div className="impact-item-label">
                Children Fed
              </div>
            </div>
            <div className="impact-item">
              <div className="impact-item-emoji">
                🌱
              </div>
              <div className="impact-item-number">
                50kg
              </div>
              <div className="impact-item-label">
                Food Waste Saved
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="how-donation-works">
          <h3 className="donation-section-title">
            How Donation Works
          </h3>
          <div className="how-steps">
            <div className="how-step">
              <div className="how-step-emoji">
                🍱
              </div>
              <h4 className="how-step-title">
                Partner Lists Food
              </h4>
              <p className="how-step-desc">
                Restaurant partner has
                unsold food near closing time
              </p>
            </div>
            <div className="how-step">
              <div className="how-step-emoji">
                🤝
              </div>
              <h4 className="how-step-title">
                Selects Center
              </h4>
              <p className="how-step-desc">
                Partner selects NGO,
                Orphanage or Shelter Home
                to donate food
              </p>
            </div>
            <div className="how-step">
              <div className="how-step-emoji">
                🚗
              </div>
              <h4 className="how-step-title">
                Center Collects
              </h4>
              <p className="how-step-desc">
                Donation center collects
                food and distributes to
                those in need! 🙏
              </p>
            </div>
          </div>
        </div>

        {/* Centers Section */}
        <h2 className="donation-section-title">
          🏛️ Donation Centers Near You
        </h2>
        <p className="donation-section-subtitle">
          Select a center to donate your
          surplus food to!
        </p>

        {/* Filter */}
        <div style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '24px'
        }}>
          {['All', 'NGO', 'ORPHANAGE',
            'OLD_AGE_HOME', 'SHELTER_HOME',
            'NEEDY_PEOPLE'].map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: '8px 18px',
                borderRadius: '20px',
                border: '2px solid',
                borderColor: activeFilter === f
                  ? '#2d6a4f' : '#e0e0e0',
                background: activeFilter === f
                  ? '#2d6a4f' : 'white',
                color: activeFilter === f
                  ? 'white' : '#6c757d',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}>
              {getCenterEmoji(f)} {
                f === 'All' ? 'All' :
                formatType(f)}
            </button>
          ))}
        </div>

        {/* Centers Grid */}
        <div className="centers-grid">
          {filteredCenters.map(center => (
            <div
              key={center.id}
              className={`center-card
                ${selectedCenter?.id === center.id
                  ? 'selected' : ''}`}
              onClick={() =>
                setSelectedCenter(center)}>

              <div className="center-type-emoji">
                {getCenterEmoji(center.type)}
              </div>

              <div className={`center-type-badge
                ${getCenterBadgeClass(
                  center.type)}`}>
                {formatType(center.type)}
              </div>

              <h3 className="center-name">
                {center.name}
              </h3>

              <p className="center-address">
                📍 {center.address}
              </p>

              <p className="center-contact">
                👤 {center.contactPerson}
              </p>

              <p className="center-phone">
                📞 {center.phone}
              </p>

              {selectedCenter?.id ===
                center.id && (
                <div style={{
                  marginTop: '12px',
                  padding: '8px 16px',
                  background: '#d8f3dc',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#1b4332',
                  textAlign: 'center'
                }}>
                  ✅ Selected!
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Selected Center Info */}
        {selectedCenter && !donated && (
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '28px',
            boxShadow: '0 8px 32px rgba(44,106,79,0.15)',
            marginTop: '24px'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '800',
              color: '#1b4332',
              marginBottom: '16px'
            }}>
              🎯 Donating to: {selectedCenter.name}
            </h3>
            <p style={{
              fontSize: '15px',
              color: '#6c757d',
              marginBottom: '20px'
            }}>
              Your food will reach
              {' '}{formatType(selectedCenter.type)}
              {' '}and help those in need! 🙏
            </p>
            <button
              onClick={handleConfirmDonation}
              disabled={loading}
              style={{
                background: loading
                  ? '#aaa'
                  : 'linear-gradient(135deg, #2d6a4f, #52b788)',
                color: 'white',
                border: 'none',
                padding: '14px 32px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}>
              {loading ? '⏳ Confirming...' : '🍱 Confirm Donation'}
            </button>
          </div>
        )}

        {/* ✅ Success Message after donation */}
        {donated && (
          <div style={{
            background: 'linear-gradient(135deg, #d8f3dc, #b7e4c7)',
            borderRadius: '20px',
            padding: '36px',
            boxShadow: '0 8px 32px rgba(44,106,79,0.2)',
            marginTop: '24px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '16px' }}>🎉</div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '800',
              color: '#1b4332',
              marginBottom: '10px'
            }}>
              Donation Confirmed!
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#2d6a4f',
              marginBottom: '8px'
            }}>
              Your food has been sent to <strong>{selectedCenter.name}</strong>! 🙏
            </p>
            <p style={{
              fontSize: '14px',
              color: '#52b788',
              marginBottom: '24px'
            }}>
              Thank you for helping reduce food waste and feeding those in need! 💚
            </p>
            <button
              onClick={() => {
                setDonated(false);
                setSelectedCenter(null);
              }}
              style={{
                background: '#2d6a4f',
                color: 'white',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer'
              }}>
              🍱 Donate More Food
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default DonationPage;