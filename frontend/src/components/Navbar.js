import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Icon from './Icon';

const navItems = [
  { k: 'dashboard', i: 'home', l: 'Home' },
  { k: 'library', i: 'library', l: 'Library' },
  { k: 'media', i: 'media', l: 'Media' },
  { k: 'podcasts', i: 'podcasts', l: 'Podcasts' },
  { k: 'videos', i: 'videos', l: 'Videos' },
  { k: 'cricfy', i: 'safari', l: 'Cricfy' },
  { k: 'cart', i: 'cart', l: 'Cart' },
  { k: 'orders', i: 'orders', l: 'Orders' },
  { k: 'upload', i: 'upload', l: 'Upload' },
  { k: 'settings', i: 'settings', l: 'Settings' },
  { k: 'social', i: 'social', l: 'Social' },
  { k: 'events', i: 'events', l: 'Events' },
  { k: 'payments', i: 'payments', l: 'Payments' },
  { k: 'smarthome', i: 'smarthome', l: 'Smart' },
  { k: 'howitworks', i: 'howitworks', l: 'How It Works' },
  { k: 'rewards', i: 'rewards', l: 'Rewards' },
];

const mainTabs = navItems.slice(0, 5);
const moreTabs = navItems.slice(5);

const Navbar = () => {
  const { page, setPage, cart, selectedCurrency, currencies, changeCurrency } = useApp();
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      <nav className="navbar navbar-3d">
        <div className="nav-inner">
          <div className="nav-brand" onClick={() => setPage('dashboard')}>
            <div className="brand-icon">⚔️</div>
            <span className="brand-text">SyntraHub</span>
          </div>
          <div className={`nav-links ${showMore ? 'show' : ''}`}>
            {navItems.map(p => (
              <button
                key={p.k}
                className={`nav-link ${page === p.k ? 'active' : ''}`}
                onClick={() => { setPage(p.k); setShowMore(false); }}
              >
                <Icon name={p.i} size={18} strokeWidth={page === p.k ? 2.5 : 1.5} />
                <span className="nav-label">{p.l}</span>
                {p.k === 'cart' && cart.total_items > 0 && (
                  <span className="cart-badge">{cart.total_items}</span>
                )}
              </button>
            ))}
          </div>
          <div className="nav-right">
            <select className="currency-select" value={selectedCurrency} onChange={e => changeCurrency(e.target.value)}>
              {currencies.map(c => <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>)}
            </select>
            <button className="mobile-menu-btn" onClick={() => setShowMore(!showMore)}>
              <Icon name="menu" size={22} />
            </button>
          </div>
        </div>
      </nav>
      <nav className="tab-bar">
        {mainTabs.map(p => (
          <button
            key={p.k}
            className={`tab-item ${page === p.k ? 'active' : ''}`}
            onClick={() => setPage(p.k)}
          >
            <Icon name={p.i} size={22} strokeWidth={page === p.k ? 2.5 : 1.5} />
            <span className="tab-label">{p.l}</span>
            {p.k === 'cart' && cart.total_items > 0 && (
              <span className="tab-badge">{cart.total_items}</span>
            )}
          </button>
        ))}
        <button className={`tab-item ${showMore ? 'active' : ''}`} onClick={() => setShowMore(!showMore)}>
          <Icon name="menu" size={22} />
          <span className="tab-label">More</span>
        </button>
      </nav>
      {showMore && <div className="dropdown-overlay" onClick={() => setShowMore(false)} />}
      <div className={`nav-dropdown ${showMore ? 'show' : ''}`}>
        {moreTabs.map(p => (
          <button
            key={p.k}
            className={`dropdown-item ${page === p.k ? 'active' : ''}`}
            onClick={() => { setPage(p.k); setShowMore(false); }}
          >
            <Icon name={p.i} size={20} strokeWidth={page === p.k ? 2.5 : 1.5} />
            <span>{p.l}</span>
            {p.k === 'cart' && cart.total_items > 0 && (
              <span className="cart-badge">{cart.total_items}</span>
            )}
          </button>
        ))}
      </div>
    </>
  );
};

export default Navbar;
