import styles from './MovieCard.module.css';

function MovieCard({ movie, onVote }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
    : null;

  return (
    <div className={styles.card}>
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
      </div>

      <div className={styles.actions}>
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
