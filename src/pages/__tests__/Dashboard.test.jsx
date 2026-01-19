import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';
import { useAuth } from '../../context/AuthContext';
import { roomAPI } from '../../services/api';

// Mock dependencies
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../services/api', () => ({
  roomAPI: {
    getRooms: vi.fn(),
  },
}));

vi.mock('../Dashboard.module.css', () => ({
  default: {
    container: 'container',
    header: 'header',
    title: 'title',
    settingsButton: 'settingsButton',
    content: 'content',
    welcomeSection: 'welcomeSection',
    subtitle: 'subtitle',
    error: 'error',
    actionsSection: 'actionsSection',
    createButton: 'createButton',
    friendsButton: 'friendsButton',
    sessionsSection: 'sessionsSection',
    emptyState: 'emptyState',
    roomGrid: 'roomGrid',
    roomCard: 'roomCard',
    roomName: 'roomName',
    roomDetails: 'roomDetails',
    roomStatus: 'roomStatus',
    roomDate: 'roomDate',
  },
}));

vi.mock('../../components/CreateRoomModal', () => ({
  default: ({ isOpen, onClose, onSuccess }) => {
    if (!isOpen) return null;
    return (
      <div data-testid="create-room-modal">
        <button onClick={onClose}>Close Modal</button>
        <button onClick={onSuccess}>Submit</button>
      </div>
    );
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

describe('Dashboard', () => {
  const mockUser = { id: '123', email: 'test@example.com' };

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ user: mockUser });
  });

  it('should render loading state initially', () => {
    roomAPI.getRooms.mockReturnValue(new Promise(() => {})); // Never resolves

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display user email', async () => {
    roomAPI.getRooms.mockResolvedValue({ rooms: [] });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('You are logged in as: test@example.com')).toBeInTheDocument();
    });
  });

  it('should display empty state when no rooms exist', async () => {
    roomAPI.getRooms.mockResolvedValue({ rooms: [] });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No active rooms yet. Create one to get started!')).toBeInTheDocument();
    });
  });

  it('should display rooms when they exist', async () => {
    const mockRooms = [
      {
        id: '1',
        name: 'Movie Night',
        is_public: true,
        created_at: '2026-01-15T00:00:00Z',
      },
      {
        id: '2',
        name: 'Private Session',
        is_public: false,
        created_at: '2026-01-16T00:00:00Z',
      },
    ];

    roomAPI.getRooms.mockResolvedValue({ rooms: mockRooms });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Movie Night')).toBeInTheDocument();
      expect(screen.getByText('Private Session')).toBeInTheDocument();
    });

    expect(screen.getByText('🌐 Public')).toBeInTheDocument();
    expect(screen.getByText('🔒 Private')).toBeInTheDocument();
  });

  it('should navigate to settings when settings button is clicked', async () => {
    roomAPI.getRooms.mockResolvedValue({ rooms: [] });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const settingsButton = screen.getByText('⚙️ Settings');
    fireEvent.click(settingsButton);

    expect(mockNavigate).toHaveBeenCalledWith('/settings');
  });

  it('should navigate to friends when friends button is clicked', async () => {
    roomAPI.getRooms.mockResolvedValue({ rooms: [] });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const friendsButton = screen.getByText('👥 Manage Friends');
    fireEvent.click(friendsButton);

    expect(mockNavigate).toHaveBeenCalledWith('/friends');
  });

  it('should open create room modal when create button is clicked', async () => {
    roomAPI.getRooms.mockResolvedValue({ rooms: [] });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const createButton = screen.getByText('+ Create New Room');
    fireEvent.click(createButton);

    expect(screen.getByTestId('create-room-modal')).toBeInTheDocument();
  });

  it('should close create room modal when close is triggered', async () => {
    roomAPI.getRooms.mockResolvedValue({ rooms: [] });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const createButton = screen.getByText('+ Create New Room');
    fireEvent.click(createButton);

    const closeButton = screen.getByText('Close Modal');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId('create-room-modal')).not.toBeInTheDocument();
    });
  });

  it('should reload rooms when room is created successfully', async () => {
    roomAPI.getRooms
      .mockResolvedValueOnce({ rooms: [] })
      .mockResolvedValueOnce({
        rooms: [
          {
            id: '1',
            name: 'New Room',
            is_public: false,
            created_at: '2026-01-18T00:00:00Z',
          },
        ],
      });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const createButton = screen.getByText('+ Create New Room');
    fireEvent.click(createButton);

    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(roomAPI.getRooms).toHaveBeenCalledTimes(2);
      expect(screen.getByText('New Room')).toBeInTheDocument();
    });
  });

  it('should navigate to room when room card is clicked', async () => {
    const mockRooms = [
      {
        id: 'room-123',
        name: 'Movie Night',
        is_public: true,
        created_at: '2026-01-15T00:00:00Z',
      },
    ];

    roomAPI.getRooms.mockResolvedValue({ rooms: mockRooms });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Movie Night')).toBeInTheDocument();
    });

    const roomCard = screen.getByText('Movie Night').closest('div[class*="roomCard"]');
    fireEvent.click(roomCard);

    expect(mockNavigate).toHaveBeenCalledWith('/session/room-123');
  });

  it('should handle API error gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    roomAPI.getRooms.mockRejectedValue(new Error('API Error'));

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No active rooms yet. Create one to get started!')).toBeInTheDocument();
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('should call getRooms on mount', async () => {
    roomAPI.getRooms.mockResolvedValue({ rooms: [] });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(roomAPI.getRooms).toHaveBeenCalledTimes(1);
  });
});
