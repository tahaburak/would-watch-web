import { useState, useEffect } from 'react';
import styles from './HeroLayout.module.css';

const BACKGROUNDS = [
  '/backgrounds/city_rain.png',
  '/backgrounds/abstract_smoke.png',
  '/backgrounds/concrete_neon.png'
];

const HeroLayout = ({ children }) => {
  const [bgImage, setBgImage] = useState(BACKGROUNDS[0]);

  useEffect(() => {
    // Check if we already have a background for this session
    const savedBg = sessionStorage.getItem('session_background');
    
    if (savedBg && BACKGROUNDS.includes(savedBg)) {
      setBgImage(savedBg);
    } else {
      // Pick a random one
      const randomBg = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
      setBgImage(randomBg);
      sessionStorage.setItem('session_background', randomBg);
    }
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
