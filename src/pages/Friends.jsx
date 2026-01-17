import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { socialAPI } from '../services/api';
import styles from './Friends.module.css';

function Friends() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [activeTab, setActiveTab] = useState('search');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (activeTab === 'following') {
      loadFollowing();
    } else if (activeTab === 'followers') {
      loadFollowers();
    }
  }, [activeTab]);

  const loadFollowing = async () => {
    setLoading(true);
    try {
      const data = await socialAPI.getFollowing();
      setFollowing(data.following || []);
    } catch (err) {
      setError('Failed to load following list');
    } finally {
      setLoading(false);
    }
  };

  const loadFollowers = async () => {
    setLoading(true);
    try {
      const data = await socialAPI.getFollowers();
      setFollowers(data.followers || []);
    } catch (err) {
      setError('Failed to load followers list');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');

    try {
      const data = await socialAPI.searchUsers(searchQuery);
      setSearchResults(data.users || []);
    } catch (err) {
      setError('Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      await socialAPI.follow(userId);
      // Update the search results to reflect the follow
      setSearchResults(searchResults.map(user =>
        user.id === userId ? { ...user, is_following: true } : user
      ));
    } catch (err) {
      setError('Failed to follow user');
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      await socialAPI.unfollow(userId);
      // Update the lists
      setSearchResults(searchResults.map(user =>
        user.id === userId ? { ...user, is_following: false } : user
      ));
      setFollowing(following.filter(user => user.id !== userId));
    } catch (err) {
      setError('Failed to unfollow user');
    }
  };

  const renderUserList = (users) => {
    if (users.length === 0) {
      return (
        <div className={styles.emptyState}>
          {activeTab === 'search' ? 'Search for users to connect' : 'No users yet'}
        </div>
      );
    }

    return (
      <div className={styles.userList}>
        {users.map(user => (
          <div key={user.id} className={styles.userCard}>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{user.username || 'Anonymous'}</div>
              <div className={styles.userEmail}>{user.email}</div>
            </div>
            {activeTab === 'search' && (
              user.is_following ? (
                <button
                  className={styles.unfollowButton}
                  onClick={() => handleUnfollow(user.id)}
                >
                  Unfollow
                </button>
              ) : (
                <button
                  className={styles.followButton}
                  onClick={() => handleFollow(user.id)}
                >
                  Follow
                </button>
              )
            )}
            {activeTab === 'following' && (
              <button
                className={styles.unfollowButton}
                onClick={() => handleUnfollow(user.id)}
              >
                Unfollow
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate('/dashboard')}>
          ← Back
        </button>
        <h1 className={styles.title}>Friends</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'search' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('search')}
          >
            Search
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'following' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('following')}
          >
            Following ({following.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'followers' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('followers')}
          >
            Followers ({followers.length})
          </button>
        </div>

        {activeTab === 'search' && (
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search by email or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className={styles.searchButton} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        )}

        {error && <div className={styles.error}>{error}</div>}

        {loading && <div className={styles.loading}>Loading...</div>}

        {!loading && (
          <>
            {activeTab === 'search' && renderUserList(searchResults)}
            {activeTab === 'following' && renderUserList(following)}
            {activeTab === 'followers' && renderUserList(followers)}
          </>
        )}
      </div>
    </div>
  );
}

export default Friends;
