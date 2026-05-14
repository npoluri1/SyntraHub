import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const steps = [
  {
    num: '01',
    title: 'Discover',
    subtitle: 'Browse curated Viking content & books',
    desc: 'Type what you\'re into — books, podcasts, videos, or Viking sagas. Results loaded in seconds from our global library.',
    mockup: (
      <div className="hiw-mockup">
        <div className="hiw-mockup-search">
          <span className="hiw-mockup-search-icon">🔍</span>
          <input type="text" className="hiw-mockup-input" value="Viking sagas, mindset, growth" readOnly />
          <span className="hiw-mockup-search-btn">Search →</span>
        </div>
        <div className="hiw-mockup-results">
          <div className="hiw-mockup-item"><span className="hiw-item-icon">📖</span> The Viking Code<span className="hiw-item-badge">Best match</span></div>
          <div className="hiw-mockup-item"><span className="hiw-item-icon">🎙️</span> Viking Mindset Podcast<span className="hiw-item-badge">42/100</span></div>
          <div className="hiw-mockup-item"><span className="hiw-item-icon">🎬</span> Runes of Growth Series<span className="hiw-item-badge">Best match</span></div>
        </div>
      </div>
    ),
  },
  {
    num: '02',
    title: 'Score',
    subtitle: 'Every item rated on quality signals',
    desc: 'Each book, podcast, and video is scored on relevance, popularity, and value. No black box — full transparency.',
    mockup: (
      <div className="hiw-mockup hiw-score-mockup">
        <div className="hiw-score-header">
          <span className="hiw-score-num">86</span>
          <span className="hiw-score-label">/100</span>
        </div>
        <div className="hiw-score-sub">The Viking Code · Anders Indset</div>
        <div className="hiw-score-rows">
          <div className="hiw-score-row"><span className="hiw-row-label">Content Quality</span><span className="hiw-row-val good">✓ 92/100</span></div>
          <div className="hiw-score-row"><span className="hiw-row-label">Popularity</span><span className="hiw-row-val good">✓ High demand</span></div>
          <div className="hiw-score-row"><span className="hiw-row-label">Reading Time</span><span className="hiw-row-val mid">~4.5 hrs</span></div>
          <div className="hiw-score-row"><span className="hiw-row-label">Actionability</span><span className="hiw-row-val good">✓ 88/100</span></div>
        </div>
      </div>
    ),
  },
  {
    num: '03',
    title: 'Learn',
    subtitle: 'AI-crafted summaries delivered daily',
    desc: 'Get chapter-by-chapter summaries with key takeaways. AI writes them using the actual book data. Read in 5 minutes.',
    mockup: (
      <div className="hiw-mockup hiw-pitch-mockup">
        <div className="hiw-pitch-header">
          <span className="hiw-pitch-icon">📋</span>
          <span>Daily Reading</span>
          <span className="hiw-pitch-ai">● AI</span>
        </div>
        <div className="hiw-pitch-body">
          <div className="hiw-pitch-title">The Viking Code — Chapter 3</div>
          <div className="hiw-pitch-text">"Micro-ambitions are small, consistent goals that foster personal and collective growth. The magic is not in the finite definition of success, but in the infinite path of progress..."</div>
          <div className="hiw-pitch-tags">
            <span className="hiw-tag">Key: Micro-ambitions</span>
            <span className="hiw-tag">5 min read</span>
          </div>
        </div>
        <div className="hiw-pitch-footer">
          <span className="hiw-pitch-copy">📋 Copy summary</span>
        </div>
      </div>
    ),
  },
  {
    num: '04',
    title: 'Grow',
    subtitle: 'Track progress & build your journey',
    desc: 'Follow your reading streaks, mark books complete, earn rewards, and watch your growth transform day by day.',
    mockup: (
      <div className="hiw-mockup hiw-follow-mockup">
        <div className="hiw-follow-header">
          <span>📊 Your Journey</span>
          <span className="hiw-follow-streak">🔥 12-day streak</span>
        </div>
        <div className="hiw-follow-items">
          <div className="hiw-follow-item done"><span>The Viking Code</span><span className="hiw-follow-status">✓ Chapter 5</span></div>
          <div className="hiw-follow-item done"><span>Viking Mindset Podcast</span><span className="hiw-follow-status">✓ Episode 4</span></div>
          <div className="hiw-follow-item active"><span>Norse Spirit</span><span className="hiw-follow-status active-status">▶ Listening now</span></div>
        </div>
        <div className="hiw-follow-cal">
          <span>📅 Next: Runes of Growth Series</span>
          <span className="hiw-follow-time">Added to your schedule</span>
        </div>
      </div>
    ),
  },
];

const features = [
  { icon: '📖', title: 'Content Quality', desc: 'Every book and podcast is rated on substance, reviews, and real-world impact.', score: '15/15' },
  { icon: '🎯', title: 'Relevance Score', desc: 'AI-powered matching to your interests and growth goals.', score: '15/15' },
  { icon: '⚡', title: 'Quick Learning', desc: '5-minute daily summaries with key takeaways. No fluff.', score: '14/15' },
  { icon: '📱', title: 'Omnichannel Access', desc: 'Get your content on Telegram, WhatsApp, Email, or right here.', score: '15/15' },
  { icon: '🏆', title: 'Rewards System', desc: 'Earn badges and unlock premium content as you grow.', score: '12/15' },
  { icon: '🔄', title: 'Sync Everywhere', desc: 'Mobile app + web. Progress follows you across devices.', score: '13/15' },
];

const HowItWorks = () => {
  const { setPage } = useApp();
  const [searchCity, setSearchCity] = useState('');
  const [searchNiche, setSearchNiche] = useState('');

  const handleStart = () => {
    if (searchCity && searchNiche) {
      setPage('library');
    }
  };

  return (
    <div className="page hiw-page">
      {/* ===== HERO ===== */}
      <section className="hiw-hero">
        <div className="hiw-hero-badge">For readers, creators & growth seekers</div>
        <h1 className="hiw-hero-title">
          Not just content.<br />
          <span className="hiw-hero-accent">Growth you can feel.</span>
        </h1>
        <p className="hiw-hero-desc">
          Discover Viking sagas, motivational podcasts, mindset books, and daily wisdom — 
          all scored, summarized, and delivered to you.
        </p>
        <div className="hiw-hero-search">
          <div className="hiw-search-box">
            <input
              type="text"
              className="hiw-search-field"
              placeholder="Your interest (e.g. Viking mindset)"
              value={searchNiche}
              onChange={e => setSearchNiche(e.target.value)}
            />
            <select className="hiw-search-select" value={searchCity} onChange={e => setSearchCity(e.target.value)}>
              <option value="">Genre</option>
              <option value="vikings">Vikings & Norse</option>
              <option value="motivation">Motivation</option>
              <option value="mindset">Mindset & Growth</option>
              <option value="books">Books & Learning</option>
              <option value="podcasts">Podcasts</option>
              <option value="all">All Categories</option>
            </select>
            <button className="hiw-search-submit" onClick={handleStart}>
              Search content →
            </button>
          </div>
          <p className="hiw-hero-tagline">Try it free — no signup. Type an interest + genre above.</p>
        </div>
        <div className="hiw-hero-cta">
          <button className="btn btn-primary btn-lg" onClick={() => setPage('library')}>
            Browse 10,000+ Titles
          </button>
          <button className="btn btn-outline btn-lg" onClick={() => setPage('podcasts')}>
            Explore Podcasts
          </button>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="hiw-section">
        <div className="hiw-section-label">How it works</div>
        <h2 className="hiw-section-title">Four steps from zero to a <span>stronger you</span>.</h2>

        <div className="hiw-steps">
          {steps.map((step, idx) => (
            <div className="hiw-step" key={idx}>
              <div className="hiw-step-content">
                <div className="hiw-step-number">{step.num}</div>
                <div className="hiw-step-header">
                  <h3 className="hiw-step-title">{step.title}</h3>
                  <p className="hiw-step-subtitle">{step.subtitle}</p>
                </div>
                <p className="hiw-step-desc">{step.desc}</p>
              </div>
              <div className="hiw-step-visual">
                {step.mockup}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FEATURES / AUDIT SECTION ===== */}
      <section className="hiw-section hiw-features-section">
        <div className="hiw-section-label">Full transparency</div>
        <h2 className="hiw-section-title">Every item scored on <span>6 proven signals</span></h2>
        <p className="hiw-section-desc">Every book, podcast, and video gets a real quality audit. No black box.</p>

        <div className="hiw-features-grid">
          <div className="hiw-feature-card hiw-feature-main">
            <div className="hiw-feature-main-header">
              <div className="hiw-feature-main-score">
                <span className="hiw-main-score-num">86</span>
                <span className="hiw-main-score-total">/100</span>
              </div>
              <div className="hiw-feature-main-label">Top pick · Viking</div>
            </div>
            <div className="hiw-feature-main-title">The Viking Code</div>
            <div className="hiw-feature-main-sub">Anders Indset · Mindset & Leadership</div>
            <div className="hiw-feature-rows">
              <div className="hiw-feature-row">
                <span className="hiw-feature-row-label">Content Depth</span>
                <span className="hiw-feature-row-val good">✓ 15/15</span>
              </div>
              <div className="hiw-feature-row">
                <span className="hiw-feature-row-label">Practical Value</span>
                <span className="hiw-feature-row-val good">✓ 14/15</span>
              </div>
              <div className="hiw-feature-row">
                <span className="hiw-feature-row-label">Reader Reviews</span>
                <span className="hiw-feature-row-val good">✓ 4.8★ · 2.1k ratings</span>
              </div>
              <div className="hiw-feature-row">
                <span className="hiw-feature-row-label">Reading Time</span>
                <span className="hiw-feature-row-val mid">~4.5 hrs total</span>
              </div>
              <div className="hiw-feature-row">
                <span className="hiw-feature-row-label">Key Concepts</span>
                <span className="hiw-feature-row-val good">✓ Micro-ambitions, Code, Growth</span>
              </div>
              <div className="hiw-feature-row">
                <span className="hiw-feature-row-label">Actionability</span>
                <span className="hiw-feature-row-val good">✓ High — daily exercises</span>
              </div>
            </div>
            <div className="hiw-feature-pitch">
              <span className="hiw-pitch-arrow">💡</span>
              <span className="hiw-pitch-text">"Micro-ambitions turn daily effort into exponential growth. Perfect for building a Viking mindset — one small win at a time."</span>
            </div>
          </div>

          {features.map((f, idx) => (
            <div className="hiw-feature-card" key={idx}>
              <div className="hiw-feature-icon">{f.icon}</div>
              <div className="hiw-feature-title">{f.title}</div>
              <div className="hiw-feature-desc">{f.desc}</div>
              <div className="hiw-feature-score">{f.score}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== VALUE PROPOSITION ===== */}
      <section className="hiw-section hiw-value-section">
        <div className="hiw-value-card">
          <div className="hiw-value-icon">⚡</div>
          <h2 className="hiw-value-title">One book can change your life.</h2>
          <p className="hiw-value-desc">
            A single transformational book or podcast typically delivers more value than a year of 
            scrolling. Our job is to find you the right content and deliver it daily.
          </p>
          <div className="hiw-value-math">
            <div className="hiw-value-math-item">
              <span className="hiw-math-num">$0</span>
              <span className="hiw-math-label">Cost to explore</span>
            </div>
            <div className="hiw-value-math-arrow">→</div>
            <div className="hiw-value-math-item">
              <span className="hiw-math-num">Unlimited</span>
              <span className="hiw-math-label">Growth potential</span>
            </div>
            <div className="hiw-value-math-arrow">→</div>
            <div className="hiw-value-math-item">
              <span className="hiw-math-num">Daily</span>
              <span className="hiw-math-label">Wisdom delivered</span>
            </div>
          </div>
          <p className="hiw-value-footnote">Start free. Upgrade only when the growth is working for you.</p>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="hiw-section">
        <div className="hiw-section-label">Simple pricing</div>
        <h2 className="hiw-section-title">Start free. <span>Scale</span> when you're ready.</h2>
        <p className="hiw-section-desc">✓ Cancel anytime · ✓ 7-day refund, no questions</p>

        <div className="hiw-pricing">
          <div className="hiw-pricing-card hiw-pricing-free">
            <h3 className="hiw-pricing-name">Free</h3>
            <div className="hiw-pricing-price"><span className="hiw-price-amount">$0</span> <span className="hiw-price-period">/forever</span></div>
            <p className="hiw-pricing-desc">~100 titles / free browsing</p>
            <ul className="hiw-pricing-features">
              <li>✓ Full library access (books, podcasts, videos)</li>
              <li>✓ Daily reading summaries</li>
              <li>✓ Content scoring & recommendations</li>
              <li>✓ No credit card needed</li>
            </ul>
            <button className="btn btn-outline btn-lg hiw-pricing-btn" onClick={() => setPage('library')}>
              Start free
            </button>
          </div>

          <div className="hiw-pricing-card hiw-pricing-popular">
            <div className="hiw-pricing-badge">Most popular</div>
            <h3 className="hiw-pricing-name">Pro</h3>
            <div className="hiw-pricing-price"><span className="hiw-price-amount">$9</span> <span className="hiw-price-period">/month</span></div>
            <p className="hiw-pricing-desc">Unlimited everything</p>
            <ul className="hiw-pricing-features">
              <li>✓ Unlimited book summaries</li>
              <li>✓ AI-powered content scoring</li>
              <li>✓ Offline reading & downloads</li>
              <li>✓ Telegram & WhatsApp delivery</li>
              <li>✓ Progress tracking & streaks</li>
              <li>✓ Priority support</li>
            </ul>
            <button className="btn btn-primary btn-lg hiw-pricing-btn" onClick={() => setPage('library')}>
              Get started
            </button>
          </div>

          <div className="hiw-pricing-card hiw-pricing-ultimate">
            <h3 className="hiw-pricing-name">Ultimate</h3>
            <div className="hiw-pricing-price"><span className="hiw-price-amount">$19</span> <span className="hiw-price-period">/month</span></div>
            <p className="hiw-pricing-desc">Everything + premium content</p>
            <ul className="hiw-pricing-features">
              <li>✓ All Pro features</li>
              <li>✓ Exclusive Viking sagas & courses</li>
              <li>✓ White-label PDF reports</li>
              <li>✓ Early access to new content</li>
              <li>✓ Community access</li>
              <li>✓ Personal growth roadmap</li>
            </ul>
            <button className="btn btn-outline btn-lg hiw-pricing-btn" onClick={() => setPage('library')}>
              Get started
            </button>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="hiw-section hiw-cta-section">
        <div className="hiw-cta-card">
          <h2 className="hiw-cta-title">Your next transformation is already out there.</h2>
          <p className="hiw-cta-desc">Thousands of books, podcasts, and videos waiting to shape your Viking mindset. Start for free — no card required.</p>
          <button className="btn btn-primary btn-lg" onClick={() => setPage('library')}>
            Start Your Journey →
          </button>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
