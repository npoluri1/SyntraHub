import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import BookCard from '../components/BookCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

const Library = () => {
  const { catalog, categories, setPage, loadCatalog } = useApp();
  const [cat, setCat] = useState('');
  const [q, setQ] = useState('');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    let f = [...catalog];
    if (cat) f = f.filter(b => b.categories?.some(c => c.slug === cat));
    if (q) {
      const lq = q.toLowerCase();
      f = f.filter(b =>
        b.title.toLowerCase().includes(lq) ||
        (b.author || '').toLowerCase().includes(lq) ||
        (b.description || '').toLowerCase().includes(lq)
      );
    }
    setFiltered(f);
  }, [cat, q, catalog]);

  return (
    <motion.div 
      className="page page-3d"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="page-header" variants={itemVariants}>
        <h1 className="page-title text-3d-strong">Book <span>Library</span></h1>
      </motion.div>
      <motion.div className="search-bar" variants={itemVariants}>
        <div className="search-wrapper">
          <input
            type="text" placeholder="Search by title, author, description..."
            value={q} onChange={e => setQ(e.target.value)}
            className="search-input"
          />
        </div>
        <select className="cat-select" value={cat} onChange={e => setCat(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.slug}>{c.icon} {c.name}</option>
          ))}
        </select>
      </motion.div>
      <motion.div className="books-grid" variants={containerVariants}>
        {filtered.map(b => (
          <motion.div key={b.id} variants={itemVariants}>
            <BookCard book={b} catalogView={true} showActions={true} />
          </motion.div>
        ))}
      </motion.div>
      {filtered.length === 0 && (
        <motion.div className="empty-state" variants={itemVariants}>
          <div className="empty-icon">📚</div>
          <h3>No Books Found</h3>
          <p>Try a different search or category filter</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Library;
