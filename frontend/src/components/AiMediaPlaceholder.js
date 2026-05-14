import React, { useMemo } from 'react';

const SVG_CACHE = {};

const generateSvg = (mediaType, accent = '#4a4ae0', size = 300) => {
  const key = `${mediaType}-${accent}-${size}`;
  if (SVG_CACHE[key]) return SVG_CACHE[key];

  const colors = {
    video: { bg: '#1a1a2e', bg2: '#16213e' },
    audio: { bg: '#2d1b69', bg2: '#1a1a2e' },
    podcast: { bg: '#1a2e1a', bg2: '#0d1f0d' },
    image: { bg: '#2e1a1a', bg2: '#1f0d0d' },
    default: { bg: '#1a1a2e', bg2: '#16213e' },
  };
  const c = colors[mediaType] || colors.default;

  let icon = '';
  if (mediaType === 'video') {
    icon = `
      <circle cx="150" cy="150" r="70" fill="none" stroke="${accent}" stroke-width="4" opacity="0.3"/>
      <polygon points="125,115 125,185 185,150" fill="${accent}" opacity="0.9"/>
      <circle cx="150" cy="150" r="90" fill="none" stroke="${accent}" stroke-width="2" opacity="0.15"/>
    `;
  } else if (mediaType === 'audio') {
    const bars = [
      { x: 110, h: 100, y: 100, d: '2s' },
      { x: 130, h: 140, y: 80, d: '1.5s' },
      { x: 150, h: 120, y: 90, d: '1.8s' },
      { x: 170, h: 160, y: 70, d: '2.2s' },
      { x: 190, h: 90, y: 105, d: '1.6s' },
    ];
    icon = bars.map(b => `
      <rect x="${b.x}" y="${b.y}" width="6" height="${b.h}" rx="3" fill="${accent}" opacity="0.8">
        <animate attributeName="height" values="${b.h};${b.h + 30};${b.h - 20};${b.h + 10};${b.h}" dur="${b.d}" repeatCount="indefinite"/>
        <animate attributeName="y" values="${b.y};${b.y - 15};${b.y + 10};${b.y - 5};${b.y}" dur="${b.d}" repeatCount="indefinite"/>
      </rect>
    `).join('');
  } else if (mediaType === 'podcast') {
    icon = `
      <circle cx="150" cy="150" r="75" fill="none" stroke="${accent}" stroke-width="3" opacity="0.3"/>
      <circle cx="150" cy="135" r="35" fill="none" stroke="${accent}" stroke-width="4"/>
      <path d="M 150 170 L 150 200" stroke="${accent}" stroke-width="4" stroke-linecap="round"/>
      <path d="M 125 195 Q 150 210 175 195" fill="none" stroke="${accent}" stroke-width="3" opacity="0.7"/>
      <path d="M 115 125 A 50 50 0 0 1 185 125" fill="none" stroke="${accent}" stroke-width="2" opacity="0.3"/>
      <circle cx="150" cy="135" r="12" fill="${accent}"/>
    `;
  } else {
    icon = `
      <rect x="90" y="90" width="120" height="120" rx="12" fill="none" stroke="${accent}" stroke-width="3"/>
      <circle cx="170" cy="120" r="15" fill="${accent}" opacity="0.6"/>
      <polygon points="90,210 130,160 160,190 210,130 210,210" fill="${accent}" opacity="0.3"/>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="${size}" height="${size}">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${c.bg}"/>
        <stop offset="100%" style="stop-color:${c.bg2}"/>
      </linearGradient>
      <filter id="g"><feGaussianBlur stdDeviation="3"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <rect width="300" height="300" rx="20" fill="url(#bg)"/>
    <g filter="url(#g)">${icon}</g>
    <circle cx="268" cy="32" r="20" fill="${accent}" opacity="0.9">
      <animate attributeName="r" values="20;22;20" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.9;0.6;0.9" dur="2s" repeatCount="indefinite"/>
    </circle>
  </svg>`;

  const encoded = encodeURIComponent(svg);
  const dataUri = `data:image/svg+xml;charset=utf-8,${encoded}`;
  SVG_CACHE[key] = dataUri;
  return dataUri;
};

const AiMediaPlaceholder = ({ type = 'video', accent, size = 300, className = '' }) => {
  const dataUri = useMemo(() => generateSvg(type, accent, size), [type, accent, size]);
  return (
    <div className={`media-placeholder ${className}`} style={{ paddingTop: `${(size / size) * 100}%` }}>
      <img src={dataUri} alt={`${type} placeholder`} decoding="async" />
      <div className="placeholder-glow" />
      <div className="media-placeholder-overlay" />
    </div>
  );
};

export default AiMediaPlaceholder;
export { generateSvg as generateMediaSvg };
