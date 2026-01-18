import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Home.module.css';

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Welcome to Would Watch</h1>
        <p className={styles.subtitle}>Your movie recommendation app</p>
        
        <div className={styles.actions}>
          {user ? (
            <button 
              className={styles.primaryButton}
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </button>
          ) : (
            <button 
              className={styles.primaryButton}
              onClick={() => navigate('/login')}
            >
              Log In / Sign Up
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
