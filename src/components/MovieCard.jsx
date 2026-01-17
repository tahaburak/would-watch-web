import styles from './MovieCard.module.css';

function MovieCard({ movie, onVote }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  return (
    <div className={styles.card}>
      {posterUrl ? (
        <img src={posterUrl} alt={movie.title} className={styles.poster} />
      ) : (
        <div className={styles.noPoster}>No Image</div>
      )}

      <div className={styles.content}>
        <h2 className={styles.title}>{movie.title}</h2>
        {movie.release_date && (
          <p className={styles.year}>
            {new Date(movie.release_date).getFullYear()}
          </p>
        )}
        <p className={styles.overview}>
          {movie.overview || 'No description available.'}
        </p>
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.button} ${styles.noButton}`}
          onClick={() => onVote('no')}
        >
          ❌ No
        </button>
        <button
          className={`${styles.button} ${styles.yesButton}`}
          onClick={() => onVote('yes')}
        >
          ✅ Yes
        </button>
      </div>
    </div>
  );
}

export default MovieCard;
