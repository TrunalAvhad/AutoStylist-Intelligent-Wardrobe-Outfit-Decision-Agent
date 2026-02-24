import { useEffect, useState } from 'react';
import { getMe } from '../services/api';
import '../styles/Profile.css';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMe()
      .then(u => setUser(u))
      .catch(e => setError(e.detail || e.error || 'Failed to load profile'));
  }, []);

  if (error) return <div className="profile-page"><div className="profile-container"><div className="error">{error}</div></div></div>;

  const initials = user?.full_name ? user.full_name.split(' ').map(n => n[0]).slice(0, 2).join('') : 'AU';

  return (
    <div className="profile-page">
      <div className="profile-container">
        {user ? (
          <>
            <div className="profile-header">
              <div className="profile-avatar">{initials}</div>
              <h2>{user.full_name}</h2>
              <p className="text-secondary">Member since {new Date(user.created_at).toLocaleDateString()}</p>
            </div>
            <div className="profile-details">
              <div className="profile-detail-item">
                <span className="label">Full Name</span>
                <span className="value">{user.full_name}</span>
              </div>
              <div className="profile-detail-item">
                <span className="label">Email Address</span>
                <span className="value">{user.email}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="loading">Loading Profile...</div>
        )}
      </div>
    </div>
  );
}
