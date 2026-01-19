import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Settings from '../Settings';
import { useAuth } from '../../context/AuthContext';
import { profileAPI } from '../../services/api';

// Mock dependencies
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../services/api', () => ({
  profileAPI: {
    getProfile: vi.fn(),
    updateProfile: vi.fn(),
  },
}));

vi.mock('../Settings.module.css', () => ({
  default: {
    container: 'container',
    loading: 'loading',
    header: 'header',
    backButton: 'backButton',
    title: 'title',
    content: 'content',
    section: 'section',
    sectionTitle: 'sectionTitle',
    field: 'field',
    label: 'label',
    input: 'input',
    hint: 'hint',
    radioGroup: 'radioGroup',
    radioLabel: 'radioLabel',
    error: 'error',
    success: 'success',
    actions: 'actions',
    saveButton: 'saveButton',
    logoutButton: 'logoutButton',
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Settings', () => {
  const mockUser = { id: '123', email: 'test@example.com' };
  const mockSignOut = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      user: mockUser,
      signOut: mockSignOut,
    });
  });

  it('should show loading state initially', () => {
    profileAPI.getProfile.mockReturnValue(new Promise(() => {}));

    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading settings...')).toBeInTheDocument();
  });

  it('should load and display profile data', async () => {
    profileAPI.getProfile.mockResolvedValue({
      username: 'testuser',
      invite_preference: 'following',
    });

    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
    });

    const followingRadio = screen.getByLabelText('People I Follow');
    expect(followingRadio).toBeChecked();
  });

  it('should display user email as disabled', async () => {
    profileAPI.getProfile.mockResolvedValue({});

    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    );

    await waitFor(() => {
      const emailInput = screen.getByDisplayValue('test@example.com');
      expect(emailInput).toBeDisabled();
    });
  });

  it('should handle profile load failure gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    profileAPI.getProfile.mockRejectedValue(new Error('Not found'));

    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    expect(screen.queryByText('Loading settings...')).not.toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  it('should update username input', async () => {
    profileAPI.getProfile.mockResolvedValue({});
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading settings...')).not.toBeInTheDocument();
    });

    const usernameInput = screen.getByPlaceholderText('Enter your username');
    await user.type(usernameInput, 'newusername');

    expect(usernameInput).toHaveValue('newusername');
  });

  it('should change invite preference', async () => {
    profileAPI.getProfile.mockResolvedValue({
      invite_preference: 'everyone',
    });

    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText('Everyone')).toBeChecked();
    });

    const followingRadio = screen.getByLabelText('People I Follow');
    fireEvent.click(followingRadio);

    expect(followingRadio).toBeChecked();
    expect(screen.getByLabelText('Everyone')).not.toBeChecked();
  });

  it('should save settings successfully', async () => {
    profileAPI.getProfile.mockResolvedValue({
      username: 'oldname',
      invite_preference: 'everyone',
    });
    profileAPI.updateProfile.mockResolvedValue({});

    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('oldname')).toBeInTheDocument();
    });

    const usernameInput = screen.getByDisplayValue('oldname');
    fireEvent.change(usernameInput, { target: { value: 'newname' } });

    const saveButton = screen.getByText('Save Settings');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(profileAPI.updateProfile).toHaveBeenCalledWith({
        username: 'newname',
        invite_preference: 'everyone',
      });
      expect(screen.getByText('Settings saved successfully!')).toBeInTheDocument();
    });
  });

  it('should show loading state during save', async () => {
    profileAPI.getProfile.mockResolvedValue({});
    let resolveUpdate;
    profileAPI.updateProfile.mockReturnValue(
      new Promise((resolve) => {
        resolveUpdate = resolve;
      })
    );

    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading settings...')).not.toBeInTheDocument();
    });

    const saveButton = screen.getByText('Save Settings');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Saving...')).toBeInTheDocument();
      expect(saveButton).toBeDisabled();
    });

    resolveUpdate({});

    await waitFor(() => {
      expect(screen.getByText('Save Settings')).toBeInTheDocument();
    });
  });

  it('should display error when save fails', async () => {
    profileAPI.getProfile.mockResolvedValue({});
    profileAPI.updateProfile.mockRejectedValue(new Error('Save failed'));

    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading settings...')).not.toBeInTheDocument();
    });

    const saveButton = screen.getByText('Save Settings');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Save failed')).toBeInTheDocument();
    });
  });

});
