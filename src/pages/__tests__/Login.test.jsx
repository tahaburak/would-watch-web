import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from '../Login';
import { useAuth } from '../../context/AuthContext';

// Mock dependencies
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../Login.module.css', () => ({
  default: {
    container: 'container',
    card: 'card',
    title: 'title',
    subtitle: 'subtitle',
    error: 'error',
    button: 'button',
    googleButton: 'googleButton',
    divider: 'divider',
    form: 'form',
    inputGroup: 'inputGroup',
    label: 'label',
    input: 'input',
    toggleText: 'toggleText',
    toggleLink: 'toggleLink',
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

describe('Login', () => {
  const mockSignIn = vi.fn();
  const mockSignUp = vi.fn();
  const mockSignInWithGoogle = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      signIn: mockSignIn,
      signUp: mockSignUp,
      signInWithGoogle: mockSignInWithGoogle,
    });
  });

  it('should render login form by default', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText('Would Watch')).toBeInTheDocument();
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('should toggle to sign up form', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const toggleLink = screen.getByText('Sign Up');
    fireEvent.click(toggleLink);

    expect(screen.getByText('Create your account')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
  });

  it('should toggle back to sign in form', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const signUpToggle = screen.getByText('Sign Up');
    fireEvent.click(signUpToggle);

    const signInToggle = screen.getByText('Sign In');
    fireEvent.click(signInToggle);

    expect(screen.getByText('Welcome back')).toBeInTheDocument();
  });

  it('should update email input', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText('Email');
    await user.type(emailInput, 'test@example.com');

    expect(emailInput).toHaveValue('test@example.com');
  });

  it('should update password input', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const passwordInput = screen.getByLabelText('Password');
    await user.type(passwordInput, 'password123');

    expect(passwordInput).toHaveValue('password123');
  });

  it('should call signIn and navigate on successful login', async () => {
    mockSignIn.mockResolvedValue({ data: { user: {} }, error: null });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should call signUp when in sign up mode', async () => {
    mockSignUp.mockResolvedValue({ data: { user: {} }, error: null });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const toggleLink = screen.getByText('Sign Up');
    fireEvent.click(toggleLink);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign Up' });

    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'newpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith('new@example.com', 'newpassword');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should display error message on failed login', async () => {
    mockSignIn.mockResolvedValue({
      data: null,
      error: { message: 'Invalid credentials' },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should display error message on failed signup', async () => {
    mockSignUp.mockResolvedValue({
      data: null,
      error: { message: 'Email already in use' },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const toggleLink = screen.getByText('Sign Up');
    fireEvent.click(toggleLink);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign Up' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email already in use')).toBeInTheDocument();
    });
  });

  it('should show loading state during submission', async () => {
    let resolveSignIn;
    mockSignIn.mockReturnValue(
      new Promise((resolve) => {
        resolveSignIn = resolve;
      })
    );

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    resolveSignIn({ data: { user: {} }, error: null });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  it('should clear error when toggling between sign in and sign up', () => {
    mockSignIn.mockResolvedValue({
      data: null,
      error: { message: 'Invalid credentials' },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(submitButton);

    waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    const toggleLink = screen.getByText('Sign Up');
    fireEvent.click(toggleLink);

    expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
  });

  it('should handle unexpected errors', async () => {
    mockSignIn.mockRejectedValue(new Error('Network error'));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
    });
  });

  it('should have required fields', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });

  it('should have correct input types', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
