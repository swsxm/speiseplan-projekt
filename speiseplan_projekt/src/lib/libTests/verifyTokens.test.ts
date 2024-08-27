/**
 * @jest-environment node
 */
import { jwtVerify } from 'jose';
import { getJwtSecretKey, verifyAuth, verifyAdmin, verifyUser } from '../verifyToken'; // adjust the path as necessary

// Mock the jwtVerify function
jest.mock('jose', () => ({
  jwtVerify: jest.fn()
}));

const mockJwtSecretKey = 'TEST-SUPER-SECRET-KEY';
const mockValidPayload = {
  jti: '1',
  iat: 1234567890,
  admin: true,
  user: 'testuser',
  email: 'test@example.com',
  employee_number: 123
};

const mockInvalidPayload = {
  jti: '1',
  iat: 1234567890,
  admin: false,
  user: 'testuser',
  email: 'test@example.com',
  employee_number: 123
};

/**
 * Verification Tests
 */
describe('getJwtSecretKey', () => {
  it('should return the JWT secret key', () => {
    process.env.TOKEN_SECRET = mockJwtSecretKey;
    expect(getJwtSecretKey()).toBe(mockJwtSecretKey);
  });

  it('should throw an error if TOKEN_SECRET is not set', () => {
    process.env.TOKEN_SECRET = '';
    expect(() => getJwtSecretKey()).toThrow('The environment variable TOKEN_SECRET is not set.');
  });
});

describe('verifyAuth', () => {
  it('should return payload if the token is valid', async () => {
    process.env.TOKEN_SECRET = mockJwtSecretKey;
    (jwtVerify as jest.Mock).mockResolvedValue({ payload: mockValidPayload });
    const token = 'valid-token';
    const result = await verifyAuth(token);
    expect(result).toEqual(mockValidPayload);
  });

  it('should return false if the token is invalid', async () => {
    (jwtVerify as jest.Mock).mockRejectedValue(new Error('Invalid token'));
    const token = 'invalid-token';
    const result = await verifyAuth(token);
    expect(result).toBe(false);
  });
});

