import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sessionAPI } from '../services/api';
import styles from './Dashboard.module.css';

function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleCreateSession = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await sessionAPI.createSession();
      navigate(`/session/${response.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Would Watch</h1>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.welcomeSection}>
          <h2>Welcome back!</h2>
          <p className={styles.subtitle}>
            You are logged in as: {user?.email}
          </p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.actionsSection}>
          <button
            className={styles.createButton}
            onClick={handleCreateSession}
            disabled={loading}
          >
            {loading ? 'Creating...' : '+ Create New Session'}
          </button>
        </div>

        <div className={styles.sessionsSection}>
          <h3>Your Sessions</h3>
          <p className={styles.emptyState}>
            No active sessions yet. Create one to get started!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
