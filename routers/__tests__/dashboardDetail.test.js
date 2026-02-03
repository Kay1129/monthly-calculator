/**
 * Jest tests for routers/dashboardDetail.js
 * Run: npm test (from project root)
 */

const request = require('supertest');
const express = require('express');

jest.mock('../../models/expense', () => ({
  findOne: jest.fn(),
  find: jest.fn(),
  aggregate: jest.fn(),
}));
jest.mock('../../models/familyMember', () => ({
  aggregate: jest.fn(),
}));

const Expense = require('../../models/expense');
const FamilyMember = require('../../models/familyMember');
const dashboardDetailRouter = require('../dashboardDetail');

const app = express();
app.use('/api', dashboardDetailRouter);

describe('GET /api/expense/monthSummary/:regDate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 when regDate format is invalid', async () => {
    const res = await request(app)
      .get('/api/expense/monthSummary/2024-InvalidMonth')
      .expect(400);

    expect(res.body.error).toBe('Invalid regDate format');
  });

  it('should return 404 with default structure when no data exists for regDate', async () => {
    Expense.aggregate.mockResolvedValueOnce([]); // last month total - empty
    Expense.findOne.mockResolvedValueOnce(null);

    const res = await request(app)
      .get('/api/expense/monthSummary/2024-January')
      .expect(404);

    expect(res.body.regDate).toBe('2024-January');
    expect(res.body.totalPrice).toBe(0.00);
    expect(res.body.averagePrice).toBe(0.00);
    expect(res.body.monthlyRecentDetaiListResult).toHaveLength(1);
    expect(res.body.monthlyRecentDetaiListResult[0].payer).toBe('N/A');
    expect(res.body.sortedExpenseSummary).toHaveLength(5);
  });

  it('should return 200 with dashboard data when data exists', async () => {
    const mockDocs = [
      {
        _doc: { payer: 'Kai', location: 'Taiping', description: 'food', regDate: '2024-January', _id: 'abc123' },
        price: { toString: () => '120.50' },
      },
    ];

    Expense.aggregate
      .mockResolvedValueOnce([{ totalPrice: 500 }]) // last month
      .mockResolvedValueOnce([{ totalPrice: 600 }]) // current month total
      .mockResolvedValueOnce([
        { _id: 'Kai', totalExpense: 300 },
        { _id: 'Yining', totalExpense: 300 },
      ]) // totalExpenseByPayer
      .mockResolvedValueOnce([{ totalCount: 5 }]); // totalCountByRegDate
    Expense.findOne.mockResolvedValueOnce({ _id: 'exists' });
    FamilyMember.aggregate.mockResolvedValueOnce([{ _id: 'Kai' }, { _id: 'Yining' }]);
    Expense.find.mockReturnValue({
      sort: () => ({
        limit: () => Promise.resolve(mockDocs),
      }),
    });

    const res = await request(app)
      .get('/api/expense/monthSummary/2024-January')
      .expect(200);

    expect(res.body.regDate).toBe('2024-January');
    expect(parseFloat(res.body.totalPrice)).toBe(600);
    expect(res.body.averagePrice).toBe('300.00');
    expect(res.body.sortedExpenseSummary).toHaveLength(5);
    expect(res.body.totalCount).toBe(5);
  });
});
