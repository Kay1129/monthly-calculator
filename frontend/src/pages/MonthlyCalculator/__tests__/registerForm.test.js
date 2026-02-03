/**
 * Jest tests for MonthlyCalculator/registerForm.js
 * Run: npm test (from frontend directory)
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import RegisterForm from '../registerForm';

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('RegisterForm', () => {
  it('should show loading state while fetching family members', () => {
    fetch.mockImplementation(() => new Promise(() => {}));
    render(<RegisterForm />);
    expect(screen.getByText(/Loading/)).toBeInTheDocument();
  });

  it('should show error when family member fetch fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Server error'));
    render(<RegisterForm />);
    await waitFor(() => {
      expect(screen.getByText(/Error/)).toBeInTheDocument();
    });
  });

  it('should render form with payer and location selects when fetch succeeds', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          familyMember: [
            { payer: 'Kai', status: 'normal' },
            { payer: 'Yining', status: 'normal' },
          ],
        }),
    });

    render(<RegisterForm />);

    await waitFor(() => {
      expect(screen.getByText('Register Entry')).toBeInTheDocument();
    });
    expect(screen.getByLabelText(/Payer/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Payment Location/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/ })).toBeInTheDocument();
  });

  it('should have Submit and Cancel buttons when form is loaded', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          familyMember: [{ payer: 'Kai', status: 'normal' }],
        }),
    });

    render(<RegisterForm />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Submit/ })).toBeInTheDocument();
    });
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });
});
