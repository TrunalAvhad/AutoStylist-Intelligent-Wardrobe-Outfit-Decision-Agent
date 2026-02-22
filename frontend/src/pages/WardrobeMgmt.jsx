import { useState, useEffect } from 'react';
import { getWardrobe, getWardrobeByCategory, getWardrobeStats, deleteWardrobeItem, BACKEND_BASE_URL } from '../services/api';
import '../styles/WardrobeMgmt.css';

export default function WardrobeMgmt() {
  const [wardrobe, setWardrobe] = useState([]);
  const [filteredWardrobe, setFilteredWardrobe] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    categories: {}
  });
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = ['all', 'top', 'bottom', 'shoes', 'accessories', 'jewellery'];

  useEffect(() => {
    loadWardrobe();
    loadStats();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredWardrobe(wardrobe);
    } else {
      setFilteredWardrobe(wardrobe.filter((item) => item.category === filter));
    }
  }, [filter, wardrobe]);

  const loadWardrobe = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getWardrobe();
      setWardrobe(response.items || []);
    } catch (err) {
      setError(err.error || 'Failed to load wardrobe');
      console.error(err);
      setWardrobe([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await getWardrobeStats();
      setStats({
        total: response.total || 0,
        categories: response.categories || {}
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await deleteWardrobeItem(itemId);
      setWardrobe(prev => prev.filter(item => item._id !== itemId));
      // Refresh stats automatically
      loadStats();
    } catch (err) {
      alert(err.error || 'Could not delete item');
    }
  };

  return (
    <div className="wardrobe-page">
      <div className="wardrobe-container">
        <div className="wardrobe-header">
          <h1>👕 My Wardrobe</h1>
          <p>Manage and organize your clothing collection</p>
        </div>

        <div className="wardrobe-stats">
          <div className="stat-card">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Items</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.categories?.top || 0}</div>
            <div className="stat-label">Tops</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.categories?.bottom || 0}</div>
            <div className="stat-label">Bottoms</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.categories?.shoes || 0}</div>
            <div className="stat-label">Shoes</div>
          </div>
        </div>

        <div className="filter-section">
          <h2>Filter by Category</h2>
          <div className="filter-buttons">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="wardrobe-grid">
          {loading ? (
            <div className="loading" style={{ gridColumn: '1 / -1' }}>
              <p>Loading wardrobe...</p>
            </div>
          ) : filteredWardrobe.length > 0 ? (
            filteredWardrobe.map((item) => (
              <div key={item._id} className="wardrobe-item-card">
                <div className="item-image" style={{ position: 'relative' }}>
                  <img
                    src={item.image_path.startsWith('http') ? item.image_path : `${BACKEND_BASE_URL}/static/${item.image_path}`}
                    alt={item.category}
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ccc" width="200" height="200"/%3E%3C/svg%3E';
                    }}
                  />
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="delete-item-btn"
                    title="Delete item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                  </button>
                </div>
                <div className="item-info">
                  <h3>{item.category.charAt(0).toUpperCase() + item.category.slice(1)}</h3>
                  <p>
                    <strong>Style:</strong> {item.style}
                  </p>
                  <p>
                    <strong>Usage:</strong> {item.usage_count} times
                  </p>
                  <p>
                    <strong>Preference:</strong> {item.preference_score}
                  </p>
                  <div className="item-colors">
                    {item.colors?.slice(0, 5).map((color, idx) => {
                      const rgbColor = Array.isArray(color) ? `rgb(${color.join(',')})` : color;
                      return (
                        <div
                          key={idx}
                          className="color-indicator"
                          style={{ backgroundColor: rgbColor }}
                          title={rgbColor}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
              <p>📭 No items in this category</p>
              <p className="empty-hint">Upload items to build your wardrobe</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
