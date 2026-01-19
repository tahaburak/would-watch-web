# Testing Guide

This document explains the testing setup and how to run tests for the Would Watch web application.

## Testing Stack

- **Unit/Component Tests**: Vitest + React Testing Library
- **E2E Tests**: Playwright
- **Coverage**: Vitest Coverage (v8)

## Running Tests

### Unit and Component Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### E2E Tests

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

## Test Structure

### Unit Tests

Unit tests are located alongside the files they test in `__tests__` directories:

- `src/context/__tests__/` - Context tests
- `src/components/__tests__/` - Component tests
- `src/pages/__tests__/` - Page tests

### E2E Tests

E2E tests are located in the `e2e/` directory:

- `e2e/auth.spec.js` - Authentication flow tests
- `e2e/rooms.spec.js` - Room management tests

## Test Coverage

Current test coverage includes:

### AuthContext (9 tests)
- ✓ Context initialization and loading states
- ✓ Session persistence
- ✓ Sign in, sign up, and sign out functionality
- ✓ Auth state change handling
- ✓ Subscription cleanup on unmount

### CreateRoomModal (13 tests)
- ✓ Modal rendering and visibility
- ✓ Form validation (empty name, whitespace)
- ✓ Input updates and checkbox toggling
- ✓ Room creation (public/private)
- ✓ Loading states during submission
- ✓ Error handling for API failures
- ✓ Form reset after successful submission

### Dashboard (12 tests)
- ✓ Loading state display
- ✓ User email display
- ✓ Empty state when no rooms
- ✓ Room list rendering
- ✓ Navigation (settings, friends, room details)
- ✓ Modal interactions
- ✓ Room reload after creation
- ✓ API error handling

### E2E Tests

#### Authentication Flow (auth.spec.js)
- Login page display
- Validation errors
- Invalid credentials handling
- Google sign-in button
- Password visibility toggle
- Protected route redirects
- Session persistence

#### Room Management (rooms.spec.js)
- Create room button and modal
- Form validation
- Public/private room toggle
- Room list display
- Room navigation
- Empty state handling

## Writing New Tests

### Unit Test Example

```javascript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### E2E Test Example

```javascript
import { test, expect } from '@playwright/test';

test('should navigate to page', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Welcome');
});
```

## Mocking

### API Mocking

```javascript
vi.mock('../../services/api', () => ({
  roomAPI: {
    getRooms: vi.fn(),
    createRoom: vi.fn(),
  },
}));
```

### Context Mocking

```javascript
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// In test
useAuth.mockReturnValue({ user: mockUser });
```

## CI/CD

Tests can be run in CI/CD pipelines:

```bash
# Run all tests (unit + coverage)
npm test -- --run
npm run test:coverage

# Run E2E tests (requires dev server)
npm run test:e2e
```

## Troubleshooting

### Act() Warnings

If you see warnings about `act()`, these are usually harmless but can be resolved by wrapping state updates in `waitFor`:

```javascript
await waitFor(() => {
  expect(screen.getByText('Updated')).toBeInTheDocument();
});
```

### Playwright Browser Issues

If Playwright browsers are not installed:

```bash
npx playwright install chromium
```

### Vitest Watch Mode

To run specific tests in watch mode:

```bash
npm test -- --watch MyComponent
```

## Best Practices

1. **Test user behavior, not implementation details**
2. **Use semantic queries** (`getByRole`, `getByLabelText`) over `getByTestId`
3. **Mock external dependencies** (API calls, Supabase)
4. **Test error states** and edge cases
5. **Keep tests isolated** - each test should be independent
6. **Use descriptive test names** that explain what is being tested

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
