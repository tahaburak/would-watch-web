import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Matches.module.css';

function Matches() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMatches();
  }, [id]);

  const fetchMatches = async () => {
    try {
      const { data: { session } } = await import('../services/supabase').then(m => m.supabase.auth.getSession());
      const token = session?.access_token;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/sessions/${id}/matches`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch matches');
      }

      const data = await response.json();
      setMatches(data || []);
    } catch (err) {
      setError('Failed to load matches');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading matches...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => navigate('/dashboard')} className={styles.backButton}>
          ← Dashboard
        </button>
        <h1 className={styles.title}>It's a Match! 🎉</h1>
      </header>

      {error && <div className={styles.error}>{error}</div>}

      {matches.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No matches yet!</p>
          <p className={styles.subtext}>Keep voting or wait for your friends.</p>
          <button 
            onClick={() => navigate(`/session/${id}/vote`)} 
            className={styles.primaryButton}
          >
            Keep Voting
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {matches.map((movie) => (
            <div key={movie.id} className={styles.card}>
              <div className={styles.posterWrapper}>
                <img 
                  src={`https://image.tmdb.org/t/p/w500${movie.metadata.poster_path}`} 
                  alt={movie.title}
                  className={styles.poster} 
                />
                <div className={styles.rating}>
                  ⭐ {Number(movie.metadata.vote_average).toFixed(1)}
                </div>
              </div>
              <div className={styles.info}>
                <h3 className={styles.movieTitle}>{movie.title}</h3>
                <p className={styles.releaseDate}>
                  {movie.metadata.release_date?.split('-')[0]}
                </p>
                <p className={styles.overview}>{movie.metadata.overview}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Matches;
