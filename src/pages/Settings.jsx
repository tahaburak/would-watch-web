import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../services/api';
import styles from './Settings.module.css';

function Settings() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [username, setUsername] = useState('');
  const [invitePreference, setInvitePreference] = useState('everyone');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await profileAPI.getProfile();
      setUsername(profile.username || '');
      setInvitePreference(profile.invite_preference || 'everyone');
    } catch (err) {
      // Profile might not exist yet, that's okay
      console.log('Profile not loaded:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await profileAPI.updateProfile({ username, invite_preference: invitePreference });
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className={styles.loading}>Loading settings...</div>
    );
  }

  return (
    <div className={styles.contentContainer}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate('/dashboard')}>
          ← Back
        </button>
        <h1 className={styles.title}>Settings</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Profile</h2>

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              className={styles.input}
              value={user?.email || ''}
              disabled
            />
            <p className={styles.hint}>Your email cannot be changed</p>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Username</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <p className={styles.hint}>This is how others will find you</p>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Privacy</h2>

          <div className={styles.field}>
            <label className={styles.label}>Who can invite me to rooms?</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="invite"
                  value="everyone"
                  checked={invitePreference === 'everyone'}
                  onChange={(e) => setInvitePreference(e.target.value)}
                />
                <span>Everyone</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="invite"
                  value="following"
                  checked={invitePreference === 'following'}
                  onChange={(e) => setInvitePreference(e.target.value)}
                />
                <span>People I Follow</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="invite"
                  value="none"
                  checked={invitePreference === 'none'}
                  onChange={(e) => setInvitePreference(e.target.value)}
                />
                <span>No One</span>
              </label>
            </div>
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <div className={styles.actions}>
          <button
            className={styles.saveButton}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>

          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
