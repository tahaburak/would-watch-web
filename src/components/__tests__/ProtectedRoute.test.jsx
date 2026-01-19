import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import { useAuth } from '../../context/AuthContext';

// Mock the AuthContext
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('ProtectedRoute', () => {
  const TestComponent = () => <div>Protected Content</div>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state when loading is true', () => {
    useAuth.mockReturnValue({
      user: null,
      loading: true,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should render children when user is authenticated', () => {
    useAuth.mockReturnValue({
      user: { id: '123', email: 'test@example.com' },
      loading: false,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('should redirect to login when user is not authenticated', () => {
    useAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <TestComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should not render children during loading', () => {
    useAuth.mockReturnValue({
      user: null,
      loading: true,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should handle user becoming authenticated', () => {
    const { rerender } = render(
      <MemoryRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </MemoryRouter>
    );

    // Initially loading
    useAuth.mockReturnValue({
      user: null,
      loading: true,
    });

    rerender(
      <MemoryRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // User logs in
    useAuth.mockReturnValue({
      user: { id: '123', email: 'test@example.com' },
      loading: false,
    });

    rerender(
      <MemoryRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should work with different child components', () => {
    useAuth.mockReturnValue({
      user: { id: '123', email: 'test@example.com' },
      loading: false,
    });

    const CustomChild = () => <div>Custom Protected Component</div>;

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <CustomChild />
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Custom Protected Component')).toBeInTheDocument();
  });

  it('should work with multiple nested elements', () => {
    useAuth.mockReturnValue({
      user: { id: '123', email: 'test@example.com' },
      loading: false,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>
            <h1>Protected Page</h1>
            <p>This is protected content</p>
          </div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Page')).toBeInTheDocument();
    expect(screen.getByText('This is protected content')).toBeInTheDocument();
  });
});
