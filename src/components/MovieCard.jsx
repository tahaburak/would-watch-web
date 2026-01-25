import { useState } from 'react';
import styles from './MovieCard.module.css';

function MovieCard({ movie, onVote }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
    : null;

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={styles.card}>
      <div
        className={`${styles.flipContainer} ${isFlipped ? styles.flipped : ''}`}
        onClick={handleCardClick}
      >
        {/* Front side - Poster */}
        <div className={styles.flipFront}>
          <div className={styles.posterContainer}>
            {posterUrl ? (
              <img src={posterUrl} alt={movie.title} className={styles.poster} />
            ) : (
              <div className={styles.noPoster}>
                <span>🎬</span>
                <p>No Image</p>
              </div>
            )}

            <div className={styles.overlay}>
              <div className={styles.info}>
                <h2 className={styles.title}>{movie.title}</h2>
                {movie.release_date && (
                  <p className={styles.year}>
                    {new Date(movie.release_date).getFullYear()}
                  </p>
                )}
              </div>
            </div>

            <div className={styles.flipHint}>
              Tap for details
            </div>
          </div>
        </div>

        {/* Back side - Details */}
        <div className={styles.flipBack}>
          <div className={styles.detailsContainer}>
            <h2 className={styles.detailsTitle}>{movie.title}</h2>
            {movie.release_date && (
              <p className={styles.detailsYear}>
                {new Date(movie.release_date).getFullYear()}
              </p>
            )}
            {movie.vote_average > 0 && (
              <div className={styles.rating}>
                ⭐ {movie.vote_average.toFixed(1)} / 10
              </div>
            )}
            <div className={styles.overview}>
              {movie.overview || 'No description available.'}
            </div>
            <div className={styles.flipHint}>
              Tap to flip back
            </div>
          </div>
        </div>
      </div>

      <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
        <button
          className={`${styles.button} ${styles.noButton}`}
          onClick={() => onVote('no')}
          aria-label="No"
        >
          <span className={styles.icon}>✕</span>
          <span className={styles.label}>No</span>
        </button>
        <button
          className={`${styles.button} ${styles.yesButton}`}
          onClick={() => onVote('yes')}
          aria-label="Yes"
        >
          <span className={styles.icon}>✓</span>
          <span className={styles.label}>Yes</span>
        </button>
      </div>
    </div>
  );
}

export default MovieCard;
