import React, { useMemo } from 'react';
import AiMediaPlaceholder from './AiMediaPlaceholder';

const ACCENTS = ['#4a4ae0', '#e040a0', '#30d158', '#ff9f0a', '#5e5ce6', '#ff375f', '#64d2ff'];

const MediaCard = ({ item }) => {
  const accent = useMemo(() => ACCENTS[item.id % ACCENTS.length], [item.id]);

  return (
    <div className="media-card media-card-3d card-shine">
      {item.embed_url ? (
        <div className="media-embed">
          <iframe src={item.embed_url} title={item.title} allowFullScreen loading="lazy" />
        </div>
      ) : item.thumbnail_url ? (
        <div className="media-thumb" style={{ backgroundImage: `url(${item.thumbnail_url})` }}>
          <div className="media-play">▶</div>
        </div>
      ) : (
        <AiMediaPlaceholder
          type={item.media_type === 'podcast' ? 'podcast' : item.media_type === 'audio' ? 'audio' : 'video'}
          accent={accent}
          size={300}
        />
      )}
      <div className="media-info">
        <h3>{item.title}</h3>
        {item.author && <p className="media-author">{item.author}</p>}
        <div className="media-tags">
          <span className="badge badge-info">{item.platform}</span>
          <span className="badge badge-warning">{item.media_type}</span>
          {item.duration_minutes && <span className="badge badge-info">{item.duration_minutes}m</span>}
        </div>
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary media-watch-btn">
          ▶ {item.media_type === 'podcast' ? 'Listen' : 'Watch'}
        </a>
      </div>
    </div>
  );
};

export default MediaCard;
