const jwt = require('jsonwebtoken');
const { auth } = require('../auth');

// Mock the store
jest.mock('../../data/store', () => ({
  users: [
    {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      role: 'developer'
    }
  ]
}));

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    // Set JWT_SECRET for tests
    process.env.JWT_SECRET = 'test-secret-key';

    req = {
      header: jest.fn()
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should authenticate valid token', () => {
    const token = jwt.sign(
      { userId: 'test-user-id' },
      process.env.JWT_SECRET
    );

    req.header.mockReturnValue(`Bearer ${token}`);

    auth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe('test-user-id');
  });

  it('should reject request without token', () => {
    req.header.mockReturnValue(undefined);

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'No authentication token, access denied'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should reject invalid token', () => {
    req.header.mockReturnValue('Bearer invalid-token');

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('should reject token for non-existent user', () => {
    const token = jwt.sign(
      { userId: 'non-existent-id' },
      process.env.JWT_SECRET
    );

    req.header.mockReturnValue(`Bearer ${token}`);

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'User not found'
    });
    expect(next).not.toHaveBeenCalled();
  });
});
