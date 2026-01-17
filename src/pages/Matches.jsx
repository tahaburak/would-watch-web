import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sessionAPI } from '../services/api';
import styles from './Matches.module.css';

function Matches() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMatches();
  }, [id]);

  const loadMatches = async () => {
    try {
      const data = await sessionAPI.getMatches(id);
      setMatches(data.matches || []);
    } catch (err) {
      setError(err.message || 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading matches...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Your Matches</h1>
        <button
          className={styles.backButton}
          onClick={() => navigate(`/session/${id}`)}
        >
          Back to Lobby
        </button>
      </div>

      <div className={styles.content}>
        {error && <div className={styles.error}>{error}</div>}

        {matches.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>No matches yet!</h3>
            <p>Keep voting to find movies you both want to watch.</p>
            <button
              className={styles.voteButton}
              onClick={() => navigate(`/session/${id}/vote`)}
            >
              Start Voting
            </button>
          </div>
        ) : (
          <div className={styles.matchesGrid}>
            {matches.map((match) => (
              <div key={match.media_id} className={styles.matchCard}>
                {match.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${match.poster_path}`}
                    alt={match.title}
                    className={styles.poster}
                  />
                ) : (
                  <div className={styles.noPoster}>No Image</div>
                )}
                <div className={styles.matchInfo}>
                  <h3 className={styles.matchTitle}>{match.title}</h3>
                  {match.release_date && (
                    <p className={styles.year}>
                      {new Date(match.release_date).getFullYear()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Matches;
