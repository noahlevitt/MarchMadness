import React from 'react';
import { vi } from 'vitest';

/* mocks */
vi.mock('../../utils/api', () => ({
  backendLogin: vi.fn(),
  backendSignUp: vi.fn(),
  queryBackend: vi.fn(),
}));
vi.mock('../../contexts/UserSessionContext', () => ({
  useUserSession: () => ({ login: vi.fn(), isLoggedIn: false }),
}));

/* regular imports */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../Login/Login';

/* tests */
describe('Login form', () => {
  test('Sign‑in disabled until both fields filled', async () => {
    render(<Login />);

    const btn = screen.getByRole('button', { name: /sign in/i });
    expect(btn).toBeDisabled();

    await userEvent.type(
      screen.getByPlaceholderText(/example@email\.com/i),
      'test@example.com',
    );
    await userEvent.type(screen.getByPlaceholderText(/password/i), 'pw');

    expect(btn).toBeEnabled();
  });

  test.skip('submits when fields are valid (needs component refactor)', () => {
  });
});

