import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sessionAPI, mediaAPI } from '../services/api';
import MovieCard from '../components/MovieCard';
import styles from './VoteSession.module.css';

function VoteSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);
  const [showMatch, setShowMatch] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setError('');

    try {
      const results = await mediaAPI.searchMovies(searchQuery);
      setMovies(results.results || []);
      setCurrentIndex(0);
    } catch (err) {
      setError(err.message || 'Failed to search movies');
    } finally {
      setSearching(false);
    }
  };

  const handleVote = async (vote) => {
    if (currentIndex >= movies.length) return;

    const currentMovie = movies[currentIndex];
    setLoading(true);
    setError('');

    try {
      const response = await sessionAPI.vote(id, currentMovie.id, vote);

      if (response.match) {
        setShowMatch(true);
        setTimeout(() => setShowMatch(false), 2000);
      }

      setCurrentIndex(currentIndex + 1);
    } catch (err) {
      setError(err.message || 'Failed to submit vote');
    } finally {
      setLoading(false);
    }
  };

  const currentMovie = movies[currentIndex];
  const hasMoreMovies = currentIndex < movies.length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Vote on Movies</h1>
        <button
          className={styles.backButton}
          onClick={() => navigate(`/session/${id}`)}
        >
          Back to Lobby
        </button>
      </div>

      <div className={styles.content}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search for movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className={styles.searchButton}
            disabled={searching}
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && <div className={styles.error}>{error}</div>}

        {showMatch && (
          <div className={styles.matchNotification}>
            🎉 It's a Match! 🎉
          </div>
        )}

        {movies.length > 0 && (
          <div className={styles.movieInfo}>
            Movie {currentIndex + 1} of {movies.length}
          </div>
        )}

        {hasMoreMovies && currentMovie ? (
          <div className={styles.movieCardWrapper}>
            <MovieCard
              movie={currentMovie}
              onVote={handleVote}
            />
            {loading && (
              <div className={styles.loadingOverlay}>
                Submitting vote...
              </div>
            )}
          </div>
        ) : movies.length > 0 ? (
          <div className={styles.emptyState}>
            <h3>No more movies!</h3>
            <p>Search for more movies to continue voting.</p>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <h3>Start by searching for movies</h3>
            <p>Use the search bar above to find movies to vote on.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default VoteSession;
