import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Dashboard.module.css';

function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Would Watch</h1>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className={styles.content}>
        <h2>Welcome to your Dashboard</h2>
        <p className={styles.subtitle}>
          You are logged in as: {user?.email}
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
