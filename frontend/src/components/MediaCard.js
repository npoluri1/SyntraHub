import React, { useMemo } from 'react';

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
  const accent = useMemo(() => ACCENTS[item.id % ACCENTS.length], [item.id]);
  const platform = PLATFORM_CONFIG[item.platform] || { icon: '▶️', label: item.platform, color: '#666' };

  return (
    <div className="media-card media-card-3d card-shine" style={{ '--platform-color': platform.color }}>
      <div className="media-platform-badge" style={{ background: platform.color }}>
        {platform.icon} {platform.label}
      </div>
      {item.embed_url ? (
        <div className="media-embed">
          <iframe src={item.embed_url} title={item.title} allowFullScreen loading="lazy" />
        </div>
      ) : item.thumbnail_url ? (
        <div className="media-thumb" style={{ backgroundImage: `url(${item.thumbnail_url})` }}>
          <div className="media-play-pulse" style={{ borderColor: platform.color }}>
            <div className="media-play" style={{ color: platform.color }}>{platform.icon}</div>
          </div>
        </div>
      ) : (
        <div className="media-placeholder" style={{ background: `linear-gradient(135deg, ${accent}33, ${accent}11)` }}>
          <div className="media-placeholder-icon">{platform.icon}</div>
        </div>
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
