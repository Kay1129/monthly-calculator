/**
 * Jest tests for routers/uploadExpense.js
 * Run: npm test (from project root)
 */

const request = require('supertest');
const express = require('express');

const mockSave = jest.fn();
jest.mock('../../models/expense', () => {
  return function (data) {
    return {
      ...data,
      save: mockSave,
    };
  };
});

const uploadExpenseRouter = require('../uploadExpense');

const app = express();
app.use(express.json());
app.use('/api', uploadExpenseRouter);

describe('POST /api/expense', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 201 with saved expense when valid data is provided', async () => {
    const newExpense = {
      payer: 'Kai',
      price: 120.5,
      location: 'Taiping',
      description: 'weekly groceries',
      regDate: '2024-January',
    };
    const savedDoc = { _id: 'abc123', ...newExpense };
    mockSave.mockResolvedValueOnce(savedDoc);

    const res = await request(app)
      .post('/api/expense')
      .send(newExpense)
      .expect(201);

    expect(res.body).toMatchObject(newExpense);
    expect(res.body._id).toBe('abc123');
  });

  it('should return 400 when save fails (e.g. validation error)', async () => {
    mockSave.mockRejectedValueOnce(new Error('Validation failed: payer is required'));

    const res = await request(app)
      .post('/api/expense')
      .send({
        payer: 'Kai',
        price: 100,
        location: 'Taiping',
        regDate: '2024-January',
      })
      .expect(400);

    expect(res.body.error).toContain('Validation failed');
  });

  it('should accept expense with optional description', async () => {
    const newExpense = {
      payer: 'Yining',
      price: 50,
      location: 'Countdown',
      description: '',
      regDate: '2024-February',
    };
    mockSave.mockResolvedValueOnce({ _id: 'def456', ...newExpense });

    const res = await request(app)
      .post('/api/expense')
      .send(newExpense)
      .expect(201);

    expect(res.body.payer).toBe('Yining');
    expect(res.body.location).toBe('Countdown');
  });
});
