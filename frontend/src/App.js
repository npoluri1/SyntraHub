import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import MediaGallery from './pages/MediaGallery';
import Podcasts from './pages/Podcasts';
import VideoChannels from './pages/VideoChannels';
import CartPage from './pages/CartPage';
import Orders from './pages/Orders';
import Settings from './pages/Settings';
import BooksPage from './pages/BooksPage';
import CricfyTv from './pages/CricfyTv';
import SocialPage from './pages/SocialPage';
import EventsPage from './pages/EventsPage';
import PaymentsPage from './pages/PaymentsPage';
import SmartHomePage from './pages/SmartHomePage';
import RewardsPage from './pages/RewardsPage';
import HowItWorks from './pages/HowItWorks';
import DailyReading from './pages/DailyReading';
import './styles.css';

const pages = [
  { k: 'dashboard', c: Dashboard },
  { k: 'library', c: Library },
  { k: 'media', c: MediaGallery },
  { k: 'podcasts', c: Podcasts },
  { k: 'videos', c: VideoChannels },
  { k: 'cart', c: CartPage },
  { k: 'orders', c: Orders },
  { k: 'cricfy', c: CricfyTv },
  { k: 'upload', c: BooksPage },
  { k: 'settings', c: Settings },
  { k: 'social', c: SocialPage },
  { k: 'events', c: EventsPage },
  { k: 'payments', c: PaymentsPage },
  { k: 'smarthome', c: SmartHomePage },
  { k: 'rewards', c: RewardsPage },
  { k: 'howitworks', c: HowItWorks },
  { k: 'reading', c: DailyReading },
];

function AppContent() {
  const { page } = useApp();

  const renderPage = () => {
    for (const p of pages) {
      if (page === p.k) {
        const Component = p.c;
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Component />
          </motion.div>
        );
      }
    }
    if (page && page.startsWith('book-')) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Library />
        </motion.div>
      );
    }
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Dashboard />
      </motion.div>
    );
  };

  return (
    <div className="app scene-3d">
      <div className="particle-bg" aria-hidden="true">
        <div className="particle-orb"></div>
        <div className="particle-orb"></div>
        <div className="particle-orb"></div>
      </div>
      <Navbar />
      <main className="main-content">
        {renderPage()}
      </main>
      <ToastContainer position="bottom-right" theme="dark" autoClose={2500} />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
