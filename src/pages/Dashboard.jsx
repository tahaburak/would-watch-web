import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { roomAPI } from '../services/api';
import CreateRoomModal from '../components/CreateRoomModal';
import styles from './Dashboard.module.css';

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const data = await roomAPI.getRooms();
      setRooms(data.rooms || []);
    } catch (err) {
      console.error('Failed to load rooms:', err);
      // Don't show error to user, just show empty list
    } finally {
      setLoading(false);
    }
  };

  const handleRoomCreated = () => {
    loadRooms();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Would Watch</h1>
        <button
          className={styles.settingsButton}
          onClick={() => navigate('/settings')}
        >
          ⚙️ Settings
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.welcomeSection}>
          <h2>Welcome back! (v3)</h2>
          <p className={styles.subtitle}>
            You are logged in as: {user?.email}
          </p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.actionsSection}>
          <button
            className={styles.createButton}
            onClick={() => setShowCreateModal(true)}
          >
            + Create New Room
          </button>

          <button
            className={styles.friendsButton}
            onClick={() => navigate('/friends')}
          >
            👥 Manage Friends
          </button>
        </div>

        <div className={styles.sessionsSection}>
          <h3>Your Rooms</h3>
          {loading ? (
            <p>Loading...</p>
          ) : rooms.length === 0 ? (
            <p className={styles.emptyState}>
              No active rooms yet. Create one to get started!
            </p>
          ) : (
            <div className={styles.roomGrid}>
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className={styles.roomCard}
                  onClick={() => navigate(`/session/${room.id}`)}
                >
                  <div className={styles.roomName}>{room.name}</div>
                  <div className={styles.roomDetails}>
                    <span className={styles.roomStatus}>
                      {room.is_public ? '🌐 Public' : '🔒 Private'}
                    </span>
                    <span className={styles.roomDate}>
                      {new Date(room.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateRoomModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleRoomCreated}
      />
    </div>
  );
}

export default Dashboard;
