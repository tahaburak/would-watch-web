import { useState, useEffect } from 'react';
import styles from './HeroLayout.module.css';

const BACKGROUNDS = [
  '/backgrounds/city_rain.png',
  '/backgrounds/abstract_smoke.png',
  '/backgrounds/concrete_neon.png',
  '/backgrounds/cyberpunk_alley.png',
  '/backgrounds/rainy_window.png'
];

const ROTATION_INTERVAL = 60000; // 1 minute

const HeroLayout = ({ children }) => {
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
        } while (newBg === currentBg); // Ensure it changes
        
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
        {children}
      </div>
    </div>
  );
};

export default HeroLayout;
