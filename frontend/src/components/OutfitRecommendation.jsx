import { useState } from 'react';
import ImageCard from './ImageCard';
import RecommendationCard from './RecommendationCard';
import '../styles/OutfitRecommendation.css';
import { sendFeedback } from '../services/api';

export default function OutfitRecommendation({ recommendations, context, onFeedbackSent }) {
  const [loading, setLoading] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState('best');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getOutfitIds = (outfitKey) => {
    const outfit = recommendations[outfitKey];
    if (!outfit) return [];
    const ids = [];
    if (outfit.top?.id) ids.push(outfit.top.id);
    if (outfit.bottom?.id) ids.push(outfit.bottom.id);
    if (outfit.extras) {
      if (outfit.extras.shoes?.id) ids.push(outfit.extras.shoes.id);
      if (outfit.extras.jewellery?.id) ids.push(outfit.extras.jewellery.id);
      if (outfit.extras.accessories) {
        outfit.extras.accessories.forEach(acc => {
          if (acc?.id) ids.push(acc.id);
        });
      }
    }
    return ids;
  };

  const handleFeedback = async (action, outfitKey) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const selectedIds = getOutfitIds(outfitKey);
      const otherKeys = ['best', 'medium', 'average'].filter(k => k !== outfitKey && recommendations[k]);
      let rawOtherIds = [];
      otherKeys.forEach(k => {
        rawOtherIds = [...rawOtherIds, ...getOutfitIds(k)];
      });
      // Deduplicate and remove any IDs that are in the disliked/liked set
      const otherIds = [...new Set(rawOtherIds)].filter(id => !selectedIds.includes(id));

      const payload = {
        liked_items: action === 'like' ? selectedIds : action === 'dislike' ? otherIds : [],
        disliked_items: action === 'dislike' ? selectedIds : action === 'like' ? otherIds : [],
        worn_items: action === 'wear' ? selectedIds : []
      };

      await sendFeedback(payload);
      setSuccess(`Feedback recorded: ${action}`);
      onFeedbackSent?.();
    } catch (err) {
      setError(err.error || 'Failed to send feedback');
    } finally {
      setLoading(false);
    }
  };

  const renderExtras = (extras) => {
    if (!extras || (!extras.shoes && !extras.accessories?.length && !extras.jewellery)) return null;
    return (
      <div className="extras-section">
        <h3>Suggested Extras</h3>
        <div className="extras-grid">
          {extras.shoes && (
            <div className="extra-item">
              <h4>👞 Shoes</h4>
              <ImageCard image={extras.shoes.image_path} title="Shoes" />
            </div>
          )}
          {extras.accessories?.length > 0 && (
            <div className="extra-item">
              <h4>🎒 Accessories</h4>
              <div className="extra-items-list">
                {extras.accessories.map((acc, idx) => (
                  <ImageCard key={idx} image={acc.image_path} />
                ))}
              </div>
            </div>
          )}
          {extras.jewellery && (
            <div className="extra-item">
              <h4>💎 Jewellery</h4>
              <ImageCard image={extras.jewellery.image_path} title="Jewellery" />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderOutfitItems = (outfit, title) => {
    if (!outfit) return null;

    const data = {
      top: outfit.top?.image_path,
      bottom: outfit.bottom?.image_path,
      score: outfit.score || 'Highly Recommended'
    };

    return (
      <div className="outfit-items-container" style={{ display: 'flex', justifyContent: 'center' }}>
        <RecommendationCard title={title} data={data} />
      </div>
    );
  };

  return (
    <div className="outfit-recommendation">
      <div className="context-info">
        <h3>Today's Context</h3>
        <div className="context-grid">
          <div className="context-item">
            <span className="label">Location:</span> {context?.city}
          </div>
          <div className="context-item">
            <span className="label">Temperature:</span> {context?.temperature}°C
          </div>
          <div className="context-item">
            <span className="label">Weather:</span> {context?.weather}
          </div>
          <div className="context-item">
            <span className="label">Occasion:</span> {context?.occasion}
          </div>
        </div>
      </div>

      <div className="recommendation-tabs">
        <button
          className={`tab-btn ${selectedOutfit === 'best' ? 'active' : ''}`}
          onClick={() => setSelectedOutfit('best')}
        >
          ⭐ Best Match
        </button>
        <button
          className={`tab-btn ${selectedOutfit === 'medium' ? 'active' : ''}`}
          onClick={() => setSelectedOutfit('medium')}
        >
          👍 Good Option
        </button>
        <button
          className={`tab-btn ${selectedOutfit === 'average' ? 'active' : ''}`}
          onClick={() => setSelectedOutfit('average')}
        >
          👌 Alternative
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="outfit-display">
        {selectedOutfit === 'best' && recommendations.best && (
          <div className="outfit-group">
            <h4 className="outfit-title">Best Match Outfit</h4>
            {renderOutfitItems(recommendations.best, "Best Match")}
            {renderExtras(recommendations.best.extras)}
            <div className="feedback-buttons">
              <button
                className="feedback-btn like"
                onClick={() => handleFeedback('like', 'best')}
                disabled={loading}
              >
                👍 Like
              </button>
              <button
                className="feedback-btn dislike"
                onClick={() => handleFeedback('dislike', 'best')}
                disabled={loading}
              >
                👎 Dislike
              </button>
              <button
                className="feedback-btn wear"
                onClick={() => handleFeedback('wear', 'best')}
                disabled={loading}
              >
                ✨ Wear This
              </button>
            </div>
          </div>
        )}

        {selectedOutfit === 'medium' && recommendations.medium && (
          <div className="outfit-group">
            <h4 className="outfit-title">Good Option</h4>
            {renderOutfitItems(recommendations.medium, "Good Option")}
            {renderExtras(recommendations.medium.extras)}
            <div className="feedback-buttons">
              <button
                className="feedback-btn like"
                onClick={() => handleFeedback('like', 'medium')}
                disabled={loading}
              >
                👍 Like
              </button>
              <button
                className="feedback-btn dislike"
                onClick={() => handleFeedback('dislike', 'medium')}
                disabled={loading}
              >
                👎 Dislike
              </button>
              <button
                className="feedback-btn wear"
                onClick={() => handleFeedback('wear', 'medium')}
                disabled={loading}
              >
                ✨ Wear This
              </button>
            </div>
          </div>
        )}

        {selectedOutfit === 'average' && recommendations.average && (
          <div className="outfit-group">
            <h4 className="outfit-title">Alternative Outfit</h4>
            {renderOutfitItems(recommendations.average, "Alternative")}
            {renderExtras(recommendations.average.extras)}
            <div className="feedback-buttons">
              <button
                className="feedback-btn like"
                onClick={() => handleFeedback('like', 'average')}
                disabled={loading}
              >
                👍 Like
              </button>
              <button
                className="feedback-btn dislike"
                onClick={() => handleFeedback('dislike', 'average')}
                disabled={loading}
              >
                👎 Dislike
              </button>
              <button
                className="feedback-btn wear"
                onClick={() => handleFeedback('wear', 'average')}
                disabled={loading}
              >
                ✨ Wear This
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
