import React from 'react';
import { vi } from 'vitest';

/* ---- mocks ---- */
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});
vi.mock('../../contexts/UserSessionContext', () => ({
  useUserSession: () => ({ isLoggedIn: false, userEmail: null, balance: 0 }),
}));

/* ---- regular imports ---- */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from '../Navbar/Navbar';

describe('Navbar quick navigation', () => {
  test('clicking "My Bets" nav item routes to /myBets', async () => {
    render(<Navbar />);
    await userEvent.click(screen.getByText(/my bets/i));
    expect(mockNavigate).toHaveBeenCalledWith('/myBets');
  });
});

