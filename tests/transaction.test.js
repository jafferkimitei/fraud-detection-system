const request = require('supertest');
const app = require('../app'); 
const mongoose = require('mongoose');

describe('POST /api/transactions', () => {
    jest.setTimeout(10000);
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a transaction', async () => {
    
    const res = await request(app)
      .post('/api/transactions')
      .send({
        userId: '682c6bbcae09ae6d2d5f6873',
        amount: 7000,
        location: 'Nairobi',
        timestamp: new Date().toISOString()
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
  });

  it('should return validation error', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .send({
        amount: -100
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});

