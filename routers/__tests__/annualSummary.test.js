/**
 * Jest tests for routers/annualSummary.js
 * Run: npm test (from project root)
 */

const request = require('supertest');
const express = require('express');

// Mock Expense model BEFORE requiring the router
jest.mock('../../models/expense', () => ({
  aggregate: jest.fn(),
}));

const Expense = require('../../models/expense');
const annualSummaryRouter = require('../annualSummary');

// Create minimal Express app for testing
const app = express();
app.use('/api', annualSummaryRouter);

describe('GET /api/expense/annualSummary/:year', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: No data - returns 404 with expected structure
  it('should return 404 and empty structure when no data exists for the year', async () => {
    Expense.aggregate.mockResolvedValueOnce([]);

    const res = await request(app)
      .get('/api/expense/annualSummary/2023')
      .expect(404);

    expect(res.body).toMatchObject({
      year: '2023',
      formatMonthlyExpenseResult: [],
      formatLocationDataResult: [],
      annualTotalExpense: 0,
      originalMonthlyLocationExpenseResult: [],
      highestExpenseLocation: { location: 'N/A', totalExpense: 0 },
      highestMonthlyExpense: { regDate: 'N/A', totalExpense: 0 },
      lowestMonthlyExpense: { regDate: 'N/A', totalExpense: 0 },
    });
    expect(res.body.message).toBe('No data found for the specified year.');
  });

  // Test 2: Has data - returns 200 with correct structure and calculations
  it('should return 200 with full structure when data exists', async () => {
    // First aggregate: monthly totals
    Expense.aggregate
      .mockResolvedValueOnce([
        { _id: '2024-January', totalExpense: 100 },
        { _id: '2024-February', totalExpense: 200 },
        { _id: '2024-March', totalExpense: 150 },
      ])
      // Second aggregate: location x month
      .mockResolvedValueOnce([
        { _id: { location: 'Taiping', regDate: '2024-January' }, totalExpense: 60 },
        { _id: { location: 'Paknsave', regDate: '2024-January' }, totalExpense: 40 },
        { _id: { location: 'Taiping', regDate: '2024-February' }, totalExpense: 120 },
        { _id: { location: 'Countdown', regDate: '2024-February' }, totalExpense: 80 },
        { _id: { location: 'Taiping', regDate: '2024-March' }, totalExpense: 150 },
      ]);

    const res = await request(app)
      .get('/api/expense/annualSummary/2024')
      .expect(200);

    // Structure checks
    expect(res.body.year).toBe('2024');
    expect(res.body.formatMonthlyExpenseResult).toHaveLength(12);
    expect(res.body.formatLocationDataResult).toHaveLength(7);
    expect(res.body.originalMonthlyLocationExpenseResult).toHaveLength(12);

    // Annual total = 100 + 200 + 150 = 450
    expect(parseFloat(res.body.annualTotalExpense)).toBe(450);

    // Highest month = February (200), lowest non-zero = January (100)
    expect(res.body.highestMonthlyExpense.totalExpense).toBe(200);
    expect(res.body.lowestMonthlyExpense.totalExpense).toBe(100);

    // Location names
    const locations = res.body.formatLocationDataResult.map((l) => l.location);
    expect(locations).toContain('Taiping');
    expect(locations).toContain('Paknsave');
    expect(locations).toContain('Others');
  });

  // Test 3: Verify highest/lowest month logic (skips zero months)
  it('should correctly compute highest and lowest months when some months are zero', async () => {
    Expense.aggregate
      .mockResolvedValueOnce([
        { _id: '2024-January', totalExpense: 500 },
        { _id: '2024-February', totalExpense: 0 },
        { _id: '2024-March', totalExpense: 50 },
        { _id: '2024-April', totalExpense: 0 },
      ])
      .mockResolvedValueOnce([
        { _id: { location: 'Taiping', regDate: '2024-January' }, totalExpense: 500 },
        { _id: { location: 'Taiping', regDate: '2024-March' }, totalExpense: 50 },
      ]);

    const res = await request(app)
      .get('/api/expense/annualSummary/2024')
      .expect(200);

    // Richest month = January (500)
    expect(res.body.highestMonthlyExpense.totalExpense).toBe(500);
    expect(res.body.highestMonthlyExpense.regDate).toContain('January');

    // Poorest non-zero month = March (50), February/April are skipped
    expect(res.body.lowestMonthlyExpense.totalExpense).toBe(50);
    expect(res.body.lowestMonthlyExpense.regDate).toContain('March');
  });
});
