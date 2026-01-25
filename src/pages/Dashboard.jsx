import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { roomAPI } from '../services/api';
import styles from './Dashboard.module.css';

function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [activeRooms, setActiveRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const data = await roomAPI.getRooms();
      setActiveRooms(data || []);
    } catch (err) {
      console.log('Failed to load rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleCreateRoom = async () => {
    const name = `${user.username || 'User'}'s Room`;
    try {
      const room = await roomAPI.createRoom(name, true);
      navigate(`/room/${room.id}`);
    } catch (err) {
      console.error('Failed to create room:', err);
    }
  };

  return (
    <div className={styles.contentContainer}>
      <div className={styles.topBar}>
        <div className={styles.logo}>Would Watch</div>
        <div className={styles.navGroup}>
          <button className={styles.navButton} onClick={() => navigate('/settings')}>
            Settings
          </button>
          <button className={styles.navButton} onClick={() => navigate('/friends')}>
            Friends
          </button>
          <button className={styles.createButton} onClick={handleCreateRoom}>
            New Room
          </button>
        </div>
      </div>

      <div className={styles.heroContent}>
        <p className={styles.welcomeText}>Welcome back, {user?.email?.split('@')[0]}</p>
        <h1 className={styles.mainTitle}>Ready to Watch?</h1>

        <div className={styles.activeRoomsSection}>
          <h2 className={styles.sectionTitle}>ACTIVE SESSIONS</h2>

          {loading ? (
            <div className={styles.emptyState}>Loading signals...</div>
          ) : activeRooms.length > 0 ? (
            <div className={styles.roomsGrid}>
              {activeRooms.map(room => (
                <div
                  key={room.id}
                  className={styles.roomPill}
                  onClick={() => navigate(`/room/${room.id}`)}
                >
                  <span className={styles.roomName}>{room.name}</span>
                  <span className={styles.roomMeta}>{room.members?.length || 1} watching</span>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.emptyState}>No active signals detected. Start a new room.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
