/**
 * Jest tests for routers/monthlyDetail.js
 * Run: npm test (from project root)
 */

const request = require('supertest');
const express = require('express');

jest.mock('../../models/expense', () => ({
  findOne: jest.fn(),
  find: jest.fn(),
  aggregate: jest.fn(),
}));

const Expense = require('../../models/expense');
const monthlyDetailRouter = require('../monthlyDetail');

const app = express();
app.use('/api', monthlyDetailRouter);

describe('GET /api/expense/:regDate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 404 with default structure when no data exists for regDate', async () => {
    Expense.findOne.mockResolvedValueOnce(null);

    const res = await request(app)
      .get('/api/expense/2024-January')
      .expect(404);

    expect(res.body.regDate).toBe('2024-January');
    expect(res.body.totalPrice).toBe('0.00');
    expect(res.body.monthlyDetaiListResult).toHaveLength(1);
    expect(res.body.monthlyDetaiListResult[0].payer).toBe('N/A');
  });

  it('should return 200 with totalPrice and monthlyDetaiListResult when data exists', async () => {
    const mockDocs = [
      {
        _doc: { payer: 'Kai', location: 'Taiping', description: 'groceries', regDate: '2024-January', _id: 'abc' },
        price: { toString: () => '120.50' },
      },
      {
        _doc: { payer: 'Yining', location: 'Countdown', description: 'food', regDate: '2024-January', _id: 'def' },
        price: { toString: () => '80.00' },
      },
    ];

    Expense.findOne.mockResolvedValueOnce({ _id: 'exists' });
    Expense.aggregate.mockResolvedValueOnce([{ totalPrice: 200.5 }]);
    Expense.find.mockResolvedValueOnce(mockDocs);

    const res = await request(app)
      .get('/api/expense/2024-January')
      .expect(200);

    expect(res.body.regDate).toBe('2024-January');
    expect(res.body.totalPrice).toBe('200.5');
    expect(res.body.monthlyDetaiListResult).toHaveLength(2);
    expect(res.body.monthlyDetaiListResult[0].price).toBe('$120.50');
  });
});
