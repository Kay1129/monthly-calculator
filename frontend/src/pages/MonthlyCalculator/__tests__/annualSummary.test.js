/**
 * Jest tests for MonthlyCalculator/annualSummary.js
 * Run: npm test (from frontend directory)
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AnnualSummary from '../annualSummary';

// Mock fetch
beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

// Mock tremor charts (avoid rendering heavy chart lib in tests)
jest.mock('@tremor/react', () => ({
  BarChart: () => <div data-testid="bar-chart" />,
  LineChart: () => <div data-testid="line-chart" />,
  DonutChart: () => <div data-testid="donut-chart" />,
  Card: ({ children }) => <div data-testid="card">{children}</div>,
  Divider: () => <hr />,
  List: ({ children }) => <ul>{children}</ul>,
  ListItem: ({ children }) => <li>{children}</li>,
  Table: ({ children }) => <table>{children}</table>,
  TableBody: ({ children }) => <tbody>{children}</tbody>,
  TableCell: ({ children }) => <td>{children}</td>,
  TableHead: ({ children }) => <thead>{children}</thead>,
  TableHeaderCell: ({ children }) => <th>{children}</th>,
  TableRow: ({ children }) => <tr>{children}</tr>,
}));

describe('AnnualSummary', () => {
  it('should show loading state initially', () => {
    fetch.mockImplementation(() => new Promise(() => {}));
    render(<AnnualSummary />);
    expect(screen.getByText(/加载中/)).toBeInTheDocument();
  });

  it('should show error message when fetch fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));
    render(<AnnualSummary />);
    await waitFor(() => {
      expect(screen.getByText(/出错了/)).toBeInTheDocument();
    });
    expect(screen.getByText(/Network error/)).toBeInTheDocument();
  });

  it('should render Annual Summary title and data when fetch succeeds', async () => {
    const mockData = {
      year: '2024',
      formatMonthlyExpenseResult: [{ date: 'Jan', Expense: '100' }],
      formatLocationDataResult: [
        { location: 'Taiping', originalTotalExpense: 500, percentage: '50%', totalExpense: '$500.00', averageExpense: '$41.67', highestExpense: '$100.00', lowestExpense: '$20.00' },
      ],
      annualTotalExpense: 1000,
      originalMonthlyLocationExpenseResult: [{ month: 'Jan', Taiping: 100 }],
      highestExpenseLocation: { location: 'Taiping', totalExpense: 500 },
      highestMonthlyExpense: { regDate: '2024-January', totalExpense: 200 },
      lowestMonthlyExpense: { regDate: '2024-February', totalExpense: 50 },
    };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    render(<AnnualSummary />);

    await waitFor(() => {
      expect(screen.getByText('Annual Summary')).toBeInTheDocument();
    });
    expect(screen.getByText('Expense overview')).toBeInTheDocument();
    expect(screen.getByText('Total Costs')).toBeInTheDocument();
    expect(screen.getByText('Favourite supermarket')).toBeInTheDocument();
    expect(screen.getAllByText('Taiping').length).toBeGreaterThan(0);
  });

  it('should handle 404 response with empty structure', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () =>
        Promise.resolve({
          year: '2024',
          formatMonthlyExpenseResult: [],
          formatLocationDataResult: [],
          annualTotalExpense: 0,
          highestExpenseLocation: { location: 'N/A', totalExpense: 0 },
          highestMonthlyExpense: { regDate: 'N/A', totalExpense: 0 },
          lowestMonthlyExpense: { regDate: 'N/A', totalExpense: 0 },
        }),
    });

    render(<AnnualSummary />);

    await waitFor(() => {
      expect(screen.getByText('Annual Summary')).toBeInTheDocument();
    });
    expect(screen.getByText('Total Costs')).toBeInTheDocument();
  });
});
