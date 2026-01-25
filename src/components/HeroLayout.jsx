import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './HeroLayout.module.css';

const BACKGROUNDS = [
  '/backgrounds/city_rain.png',
  '/backgrounds/abstract_smoke.png',
  '/backgrounds/concrete_neon.png',
  '/backgrounds/cyberpunk_alley.png',
  '/backgrounds/rainy_window.png',
  '/backgrounds/sunset_window.png'
];

const ROTATION_INTERVAL = 60000; // 1 minute

// Animation variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 10,
    scale: 0.98
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    y: -10,
    scale: 1.02
  }
};

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.4
};

const HeroLayout = () => {
  const location = useLocation();
  
  // Initialize state lazily to prevent flicker
  const [bgImage, setBgImage] = useState(() => {
    const savedBg = sessionStorage.getItem('session_background');
    if (savedBg && BACKGROUNDS.includes(savedBg)) {
      return savedBg;
    }
    const randomBg = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
    sessionStorage.setItem('session_background', randomBg);
    return randomBg;
  });

  useEffect(() => {
    // Rotation logic
    const intervalId = setInterval(() => {
      setBgImage(currentBg => {
        let newBg;
        do {
          newBg = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
        } while (newBg === currentBg); 
        
        sessionStorage.setItem('session_background', newBg);
        return newBg;
      });
    }, ROTATION_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={styles.heroWrapper}>
      <div 
        className={styles.heroBackground} 
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className={styles.heroOverlay} />
      
      <div className={styles.contentContainer}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HeroLayout;
