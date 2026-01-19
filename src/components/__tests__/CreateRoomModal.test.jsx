import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateRoomModal from '../CreateRoomModal';
import { roomAPI } from '../../services/api';

// Mock the API
vi.mock('../../services/api', () => ({
  roomAPI: {
    createRoom: vi.fn(),
  },
}));

// Mock CSS modules
vi.mock('../CreateRoomModal.module.css', () => ({
  default: {
    overlay: 'overlay',
    modal: 'modal',
    header: 'header',
    closeButton: 'closeButton',
    form: 'form',
    field: 'field',
    checkboxLabel: 'checkboxLabel',
    hint: 'hint',
    error: 'error',
    actions: 'actions',
    cancelButton: 'cancelButton',
    createButton: 'createButton',
  },
}));

describe('CreateRoomModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    render(
      <CreateRoomModal isOpen={false} onClose={mockOnClose} onSuccess={mockOnSuccess} />
    );

    expect(screen.queryByText('Create New Room')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(
      <CreateRoomModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />
    );

    expect(screen.getByText('Create New Room')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Movie Night 🍿')).toBeInTheDocument();
    expect(screen.getByText('Public Room')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    render(
      <CreateRoomModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />
    );

    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when cancel button is clicked', () => {
    render(
      <CreateRoomModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should show validation error when submitting empty name', async () => {
    render(
      <CreateRoomModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />
    );

    const submitButton = screen.getByText('Create Room');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Room name is required')).toBeInTheDocument();
    });

    expect(roomAPI.createRoom).not.toHaveBeenCalled();
  });

  it('should update name input value', async () => {
    const user = userEvent.setup();

    render(
      <CreateRoomModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />
    );

    const input = screen.getByPlaceholderText('e.g. Movie Night 🍿');
    await user.type(input, 'Test Room');

    expect(input).toHaveValue('Test Room');
  });

  it('should toggle isPublic checkbox', () => {
    render(
      <CreateRoomModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('should create room successfully', async () => {
    const user = userEvent.setup();
    roomAPI.createRoom.mockResolvedValue({ id: '123', name: 'Test Room' });

    render(
      <CreateRoomModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />
    );

    const input = screen.getByPlaceholderText('e.g. Movie Night 🍿');
    await user.type(input, 'Test Room');

    const submitButton = screen.getByText('Create Room');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(roomAPI.createRoom).toHaveBeenCalledWith('Test Room', false);
    });

    expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should create public room when checkbox is checked', async () => {
    const user = userEvent.setup();
    roomAPI.createRoom.mockResolvedValue({ id: '123', name: 'Test Room' });

    render(
      <CreateRoomModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />
    );

    const input = screen.getByPlaceholderText('e.g. Movie Night 🍿');
    await user.type(input, 'Test Room');

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    const submitButton = screen.getByText('Create Room');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(roomAPI.createRoom).toHaveBeenCalledWith('Test Room', true);
    });
  });

  it('should show loading state during submission', async () => {
    const user = userEvent.setup();
    let resolveCreate;
    roomAPI.createRoom.mockReturnValue(
      new Promise((resolve) => {
        resolveCreate = resolve;
      })
    );

    render(
      <CreateRoomModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />
    );

    const input = screen.getByPlaceholderText('e.g. Movie Night 🍿');
    await user.type(input, 'Test Room');

    const submitButton = screen.getByText('Create Room');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Creating...')).toBeInTheDocument();
    });

    expect(submitButton).toBeDisabled();

    resolveCreate({ id: '123', name: 'Test Room' });

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('should show error message when API call fails', async () => {
    const user = userEvent.setup();
    roomAPI.createRoom.mockRejectedValue(new Error('API Error'));

    render(
      <CreateRoomModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />
    );

    const input = screen.getByPlaceholderText('e.g. Movie Night 🍿');
    await user.type(input, 'Test Room');

    const submitButton = screen.getByText('Create Room');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to create room. Please try again.')).toBeInTheDocument();
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should clear form after successful submission', async () => {
    const user = userEvent.setup();
    roomAPI.createRoom.mockResolvedValue({ id: '123', name: 'Test Room' });

    const { rerender } = render(
      <CreateRoomModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />
    );

    const input = screen.getByPlaceholderText('e.g. Movie Night 🍿');
    await user.type(input, 'Test Room');

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    const submitButton = screen.getByText('Create Room');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });

    // Reopen the modal to check if form is cleared
    rerender(
      <CreateRoomModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />
    );

    expect(screen.getByPlaceholderText('e.g. Movie Night 🍿')).toHaveValue('');
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('should trim whitespace from room name', async () => {
    const user = userEvent.setup();
    roomAPI.createRoom.mockResolvedValue({ id: '123', name: 'Test Room' });

    render(
      <CreateRoomModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />
    );

    const input = screen.getByPlaceholderText('e.g. Movie Night 🍿');
    await user.type(input, '   ');

    const submitButton = screen.getByText('Create Room');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Room name is required')).toBeInTheDocument();
    });

    expect(roomAPI.createRoom).not.toHaveBeenCalled();
  });
});
