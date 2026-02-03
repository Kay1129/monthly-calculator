/**
 * Jest tests for routers/familyMember.js
 * Run: npm test (from project root)
 */

const request = require('supertest');
const express = require('express');

jest.mock('../../models/familyMember', () => ({
  aggregate: jest.fn(),
}));

const FamilyMember = require('../../models/familyMember');
const familyMemberRouter = require('../familyMember');

const app = express();
app.use('/api', familyMemberRouter);

describe('GET /api/familyMember', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 with empty array when no family members exist', async () => {
    FamilyMember.aggregate.mockResolvedValueOnce([]);

    const res = await request(app)
      .get('/api/familyMember')
      .expect(200);

    expect(res.body).toHaveProperty('familyMember');
    expect(res.body.familyMember).toEqual([]);
  });

  it('should return 200 with family members when data exists', async () => {
    const mockMembers = [
      { payer: 'Kai', status: 'normal' },
      { payer: 'Yining', status: 'normal' },
      { payer: 'Lenora', status: 'on leave' },
    ];
    FamilyMember.aggregate.mockResolvedValueOnce(mockMembers);

    const res = await request(app)
      .get('/api/familyMember')
      .expect(200);

    expect(res.body.familyMember).toHaveLength(3);
    expect(res.body.familyMember[0]).toEqual({ payer: 'Kai', status: 'normal' });
    expect(res.body.familyMember[2].status).toBe('on leave');
  });

  it('should return 500 when database throws an error', async () => {
    FamilyMember.aggregate.mockRejectedValueOnce(new Error('DB connection failed'));

    const res = await request(app)
      .get('/api/familyMember')
      .expect(500);

    expect(res.body.error).toBe('DB connection failed');
  });
});
