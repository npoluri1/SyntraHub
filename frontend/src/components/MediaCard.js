import React, { useMemo, useState } from 'react';
import AiMediaPlaceholder from './AiMediaPlaceholder';

const ACCENTS = ['#4a4ae0', '#e040a0', '#30d158', '#ff9f0a', '#5e5ce6', '#ff375f', '#64d2ff'];

const PLATFORM_CONFIG = {
  youtube: { icon: '▶️', label: 'YouTube', color: '#ff0000' },
  tiktok: { icon: '🎵', label: 'TikTok', color: '#00f2ea' },
  instagram: { icon: '📸', label: 'Instagram', color: '#e4405f' },
  facebook: { icon: '📘', label: 'Facebook', color: '#1877f2' },
  spotify: { icon: '🎧', label: 'Spotify', color: '#1db954' },
  apple: { icon: '🍎', label: 'Apple Podcasts', color: '#a2aaad' },
};

const MediaCard = ({ item }) => {
  const accent = useMemo(() => ACCENTS[(item.id || 0) % ACCENTS.length], [item.id]);
  const [thumbError, setThumbError] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);
  const platform = PLATFORM_CONFIG[item.platform] || { icon: '▶️', label: item.platform, color: '#666' };

  return (
    <div className="media-card media-card-3d card-shine" style={{ '--platform-color': platform.color }}>
      <div className="media-platform-badge" style={{ background: platform.color }}>
        {platform.icon} {platform.label}
      </div>
      
      {item.embed_url && showEmbed ? (
        <div className="media-embed">
          <iframe 
            src={item.embed_url} 
            title={item.title} 
            allowFullScreen 
            loading="lazy" 
            onError={() => {
              setShowEmbed(false);
              setThumbError(true); // If embed fails, maybe thumb fails too
            }}
          />
          <button className="btn-close-embed" onClick={() => setShowEmbed(false)}>×</button>
        </div>
      ) : item.thumbnail_url && !thumbError ? (
        <div 
          className="media-thumb" 
          style={{ backgroundImage: `url(${item.thumbnail_url})` }}
          onClick={() => item.embed_url ? setShowEmbed(true) : window.open(item.url, '_blank')}
        >
          <div className="media-play-pulse" style={{ borderColor: platform.color }}>
            <div className="media-play" style={{ color: platform.color }}>{platform.icon}</div>
          </div>
          <img src={item.thumbnail_url} alt="" style={{ display: 'none' }} onError={() => setThumbError(true)} />
        </div>
      ) : (
        <AiMediaPlaceholder 
          type={item.media_type || 'video'} 
          accent={accent} 
          className="media-thumb-fallback"
          onClick={() => item.embed_url ? setShowEmbed(true) : window.open(item.url, '_blank')}
        />
      )}
      <div className="media-info">
        <h3 className="media-title">{item.title}</h3>
        {item.author && <p className="media-author">by {item.author}</p>}
        <div className="media-tags">
          {(item.tags || []).slice(0, 3).map(t => (
            <span key={t} className="badge badge-tag">#{t}</span>
          ))}
          {item.duration_minutes && <span className="badge badge-time">{item.duration_minutes}m</span>}
        </div>
        <a href={item.url} target="_blank" rel="noopener noreferrer"
          className="btn btn-sm media-watch-btn"
          style={{ background: platform.color, borderColor: platform.color }}>
          {platform.icon} Open on {platform.label}
        </a>
      </div>
    </div>
  );
};

export default MediaCard;
