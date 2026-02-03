/**
 * Jest tests for MonthlyCalculator/expenseDetail.js
 * Run: npm test (from frontend directory)
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ExpenseDetail from '../expenseDetail';

jest.mock('@headlessui/react', () => {
  const React = require('react');
  const Menu = ({ children }) => React.createElement('div', null, children);
  Menu.Item = ({ children }) => {
    const child = typeof children === 'function' ? children({ active: false }) : children;
    return React.createElement('div', null, child);
  };
  return {
    Menu,
    MenuButton: ({ children }) => React.createElement('button', null, children),
    MenuItems: ({ children }) => React.createElement('div', null, children),
  };
});
jest.mock('@heroicons/react/20/solid', () => ({
  ChevronDownIcon: () => <span>chevron</span>,
}));

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('ExpenseDetail', () => {
  it('should show loading state initially', () => {
    fetch.mockImplementation(() => new Promise(() => {}));
    render(<ExpenseDetail />);
    expect(screen.getByText(/加载中/)).toBeInTheDocument();
  });

  it('should show error message when fetch fails', async () => {
    fetch.mockRejectedValueOnce(new Error('API error'));
    render(<ExpenseDetail />);
    await waitFor(() => {
      expect(screen.getByText(/出错了/)).toBeInTheDocument();
    });
  });

  it('should render Monthly and Personal expense detail when both fetches succeed', async () => {
    const monthlyData = {
      regDate: '2024-January',
      totalPrice: 500,
      monthlyDetaiListResult: [
        { _id: '1', payer: 'Kai', location: 'Taiping', price: '$100', regDate: '2024-January', description: 'food' },
      ],
    };
    const personalData = {
      regDate: '2024-January',
      totalPrice: '$100',
      personalDetaiListResult: [
        { _id: '1', payer: 'Kai', location: 'Taiping', price: '$100', description: 'food' },
      ],
    };

    fetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(monthlyData) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(personalData) });

    render(<ExpenseDetail />);

    await waitFor(() => {
      expect(screen.getByText('Expense Detail')).toBeInTheDocument();
    });
    expect(screen.getByText('Monthly Expense Detail')).toBeInTheDocument();
    expect(screen.getByText('Personal Expense Detail')).toBeInTheDocument();
  });
});
