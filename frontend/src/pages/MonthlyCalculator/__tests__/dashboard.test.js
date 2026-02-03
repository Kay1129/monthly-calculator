/**
 * Jest tests for MonthlyCalculator/dashboard.js
 * Run: npm test (from frontend directory)
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../dashboard';

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Dashboard', () => {
  it('should show loading state initially', () => {
    fetch.mockImplementation(() => new Promise(() => {}));
    renderWithRouter(<Dashboard />);
    expect(screen.getByText(/加载中/)).toBeInTheDocument();
  });

  it('should show error message when fetch fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Failed to fetch'));
    renderWithRouter(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText(/出错了/)).toBeInTheDocument();
    });
    expect(screen.getByText(/Failed to fetch/)).toBeInTheDocument();
  });

  it('should render Dashboard with data when fetch succeeds', async () => {
    const mockData = {
      regDate: '2024-January',
      totalPrice: 1200,
      averagePrice: '300.00',
      totalCount: 5,
      lastTotalPrice: '$1000',
      monthDiff: '+20%',
      diffStatus: 'negative',
      sortedExpenseSummary: [
        { name: 'Kai', paid: '$400', toBePaid: '-$100' },
        { name: 'Yining', paid: '$300', toBePaid: '$0' },
      ],
      monthlyRecentDetaiListResult: [
        { _id: '1', payer: 'Kai', price: '$50', regDate: '2024-January', description: 'food' },
      ],
    };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    renderWithRouter(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
    expect(screen.getByText('Total Expense')).toBeInTheDocument();
    expect(screen.getByText('Expense Count')).toBeInTheDocument();
    expect(screen.getByText('Average Costs')).toBeInTheDocument();
    expect(screen.getByText('Recent activity')).toBeInTheDocument();
    expect(screen.getByText('New expense')).toBeInTheDocument();
  });

  it('should render dashboard with default structure when 404 returns empty data', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () =>
        Promise.resolve({
          regDate: '2024-January',
          totalPrice: 0,
          averagePrice: 0,
          totalCount: 0,
          sortedExpenseSummary: [],
          monthlyRecentDetaiListResult: [{ payer: 'N/A' }],
        }),
    });

    renderWithRouter(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
    expect(screen.getByText('Total Expense')).toBeInTheDocument();
    expect(screen.getByText('Recent activity')).toBeInTheDocument();
  });
});
