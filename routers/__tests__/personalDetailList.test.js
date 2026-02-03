/**
 * Jest tests for routers/personalDetailList.js
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
const personalDetailListRouter = require('../personalDetailList');

const app = express();
app.use('/api', personalDetailListRouter);

describe('GET /api/expense/:regDate/:payer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 404 with default structure when no data exists for payer+regDate', async () => {
    Expense.findOne.mockResolvedValueOnce(null);

    const res = await request(app)
      .get('/api/expense/2024-January/Kai')
      .expect(404);

    expect(res.body.regDate).toBe('2024-January');
    expect(res.body.totalPrice).toBe('$0.00');
    expect(res.body.personalDetaiListResult).toHaveLength(1);
    expect(res.body.personalDetaiListResult[0].payer).toBe('Kai');
    expect(res.body.personalDetaiListResult[0].location).toBe('N/A');
  });

  it('should return 200 with totalPrice and personalDetaiListResult when data exists', async () => {
    const mockDocs = [
      {
        _doc: { payer: 'Kai', location: 'Taiping', description: 'weekly food', regDate: '2024-January', _id: 'xyz' },
        price: { toString: () => '150.00' },
      },
    ];

    Expense.findOne.mockResolvedValueOnce({ _id: 'exists' });
    Expense.aggregate.mockResolvedValueOnce([{ totalPrice: 150 }]);
    Expense.find.mockResolvedValueOnce(mockDocs);

    const res = await request(app)
      .get('/api/expense/2024-January/Kai')
      .expect(200);

    expect(res.body.regDate).toBe('2024-January');
    expect(res.body.totalPrice).toBe('$150');
    expect(res.body.personalDetaiListResult).toHaveLength(1);
    expect(res.body.personalDetaiListResult[0].price).toBe('$150.00');
  });

  it('should handle multiple expense records for same payer and month', async () => {
    const mockDocs = [
      { _doc: { payer: 'Kai', location: 'Taiping', description: 'a', regDate: '2024-January', _id: '1' }, price: { toString: () => '100' } },
      { _doc: { payer: 'Kai', location: 'Countdown', description: 'b', regDate: '2024-January', _id: '2' }, price: { toString: () => '50' } },
    ];

    Expense.findOne.mockResolvedValueOnce({ _id: 'exists' });
    Expense.aggregate.mockResolvedValueOnce([{ totalPrice: 150 }]);
    Expense.find.mockResolvedValueOnce(mockDocs);

    const res = await request(app)
      .get('/api/expense/2024-January/Kai')
      .expect(200);

    expect(res.body.personalDetaiListResult).toHaveLength(2);
    expect(parseFloat(res.body.totalPrice.replace('$', ''))).toBe(150);
  });
});
