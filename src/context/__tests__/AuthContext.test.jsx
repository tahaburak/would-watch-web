import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { supabase } from '../../services/supabase';

// Mock Supabase
vi.mock('../../services/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signInWithPassword: vi.fn(),
      signInWithOAuth: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

// Test component that uses the hook
const TestComponent = () => {
  const { user, loading, signIn, signUp, signOut } = useAuth();

  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'ready'}</div>
      <div data-testid="user">{user ? user.email : 'no user'}</div>
      <button onClick={() => signIn('test@example.com', 'password')}>Sign In</button>
      <button onClick={() => signUp('test@example.com', 'password')}>Sign Up</button>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementation
    supabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    supabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
  });

  it('should provide context value when used within AuthProvider', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // If we got here without errors, the context is working
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('should initialize with loading state', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('loading');

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });
  });

  it('should set user to null when no session exists', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('no user');
    });
  });

  it('should set user when session exists', async () => {
    const mockUser = { id: '123', email: 'test@example.com' };
    supabase.auth.getSession.mockResolvedValue({
      data: { session: { user: mockUser } },
      error: null,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
    });
  });

  it('should call signInWithPassword when signIn is invoked', async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: { email: 'test@example.com' } },
      error: null,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    const signInButton = screen.getByText('Sign In');
    signInButton.click();

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
      });
    });
  });

  it('should call signUp when signUp is invoked', async () => {
    supabase.auth.signUp.mockResolvedValue({
      data: { user: { email: 'test@example.com' } },
      error: null,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    const signUpButton = screen.getByText('Sign Up');
    signUpButton.click();

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
      });
    });
  });

  it('should call signOut when signOut is invoked', async () => {
    supabase.auth.signOut.mockResolvedValue({ error: null });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    const signOutButton = screen.getByText('Sign Out');
    signOutButton.click();

    await waitFor(() => {
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });
  });

  it('should update user when auth state changes', async () => {
    let authCallback;
    supabase.auth.onAuthStateChange.mockImplementation((callback) => {
      authCallback = callback;
      return {
        data: { subscription: { unsubscribe: vi.fn() } },
      };
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    // Simulate auth state change
    const mockUser = { id: '456', email: 'newuser@example.com' };
    authCallback('SIGNED_IN', { user: mockUser });

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('newuser@example.com');
    });
  });

  it('should unsubscribe on unmount', async () => {
    const unsubscribeMock = vi.fn();
    supabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: unsubscribeMock } },
    });

    const { unmount } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready');
    });

    unmount();

    expect(unsubscribeMock).toHaveBeenCalled();
  });
});
