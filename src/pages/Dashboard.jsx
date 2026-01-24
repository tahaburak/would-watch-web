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
  
  // Use a placeholder loaded state or fetch a real movie poster if possible
  const [heroImage, setHeroImage] = useState('https://image.tmdb.org/t/p/original/8Y43POKjjKDGI9MH89NW0NAzzp8.jpg'); 

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const data = await roomAPI.getRooms();
      setRooms(data.rooms || []);
    } catch (err) {
      console.error('Failed to load rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomCreated = () => {
    loadRooms();
  };

  return (
    <div className={styles.heroWrapper}>
      {/* Background Layer */}
      <div 
        className={styles.heroBackground} 
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Gradient Overlay */}
      <div className={styles.heroOverlay} />

      {/* Main Content Layer */}
      <div className={styles.contentContainer}>
        {/* Top Navigation Bar */}
        <div className={styles.topBar}>
          <div className={styles.logo}>Would Watch</div>
          <div className={styles.navGroup}>
             <button 
              className={styles.createButton}
              onClick={() => setShowCreateModal(true)}
            >
              + New Room
            </button>
            <button 
              className={styles.navButton}
              onClick={() => navigate('/friends')}
            >
              Friends
            </button>
            <button 
              className={styles.navButton}
              onClick={() => navigate('/settings')}
            >
              Settings
            </button>
          </div>
        </div>

        {/* Bottom Hero Content */}
        <div className={styles.heroContent}>
          <div className={styles.welcomeText}>
            Welcome back, {user?.email?.split('@')[0]}
          </div>
          <h1 className={styles.mainTitle}>
            Ready to Watch?
          </h1>

          {/* Active Rooms Section */}
          <div className={styles.activeRoomsSection}>
            <div className={styles.sectionTitle}>Active Sessions</div>
            
            {loading ? (
              <div className={styles.emptyState}>Loading signals...</div>
            ) : rooms.length === 0 ? (
              <div className={styles.emptyState}>No active signals detected. Start a new room.</div>
            ) : (
              <div className={styles.roomsGrid}>
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className={styles.roomPill}
                    onClick={() => navigate(`/session/${room.id}`)}
                  >
                    <div className={styles.roomName}>{room.name}</div>
                    <div className={styles.roomMeta}>
                      <span className={`${styles.statusDot} ${!room.is_public ? styles.privateDot : ''}`} />
                      {room.is_public ? 'Public' : 'Private'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
