import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sessionAPI } from '../services/api';
import styles from './SessionLobby.module.css';

function SessionLobby() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadSession();
  }, [id]);

  const loadSession = async () => {
    try {
      const data = await sessionAPI.getSession(id);
      setSession(data);
    } catch (err) {
      setError(err.message || 'Failed to load session');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/session/${id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartVoting = () => {
    navigate(`/session/${id}/vote`);
  };

  const handleViewMatches = () => {
    navigate(`/session/${id}/matches`);
  };

  if (loading) {
    return (
      <div className={styles.contentContainer}>
        <div className={styles.loading}>Loading session...</div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className={styles.contentContainer}>
        <div className={styles.errorCard}>
          <div className={styles.error}>{error || 'Session not found'}</div>
          <button className={styles.backLink} onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.contentContainer}>
      <div className={styles.card}>
        <h1 className={styles.title}>Session Lobby</h1>

        <div className={styles.sessionInfo}>
          <div className={styles.infoItem}>
            <label className={styles.label}>Session ID:</label>
            <div className={styles.sessionId}>
              <code>{id}</code>
              <button
                className={styles.copyButton}
                onClick={handleCopyLink}
              >
                {copied ? '✓ Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>

          <div className={styles.infoItem}>
            <label className={styles.label}>Status:</label>
            <span className={styles.statusBadge}>{session.status}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.primaryButton}
            onClick={handleStartVoting}
          >
            Start Voting
          </button>

          <button
            className={styles.secondaryButton}
            onClick={handleViewMatches}
          >
            View Matches
          </button>

          <button
            className={styles.backLink}
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default SessionLobby;
