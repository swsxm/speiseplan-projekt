/**
 * @jest-environment node
 */
import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import { getJwtSecretKey, verifyAuth, verifyAdmin, verifyUser } from '../verifyToken'; 

// Mock the jwtVerify function
jest.mock('jose', () => ({
  jwtVerify: jest.fn()
}));

// Mock the NextRequest
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn()
  }
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

describe('verifyAdmin', () => {
  it('should return payload if the user is an admin', async () => {
    const token = 'valid-admin-token';
    const req = { cookies: { get: jest.fn().mockReturnValue({ value: token }) } } as unknown as NextRequest;
    
    process.env.TOKEN_SECRET = mockJwtSecretKey;
    (jwtVerify as jest.Mock).mockResolvedValue({ payload: mockValidPayload });
    
    const result = await verifyAdmin(req);
    expect(result).toEqual(mockValidPayload);
  });

  it('should return 401 if no token is provided', async () => {
    const req = { cookies: { get: jest.fn().mockReturnValue(undefined) } } as unknown as NextRequest;
    
    const result = await verifyAdmin(req);
    expect(result).toEqual(NextResponse.json({ status: 401, message: "Unauthorized" }));
  });

  it('should return 403 if the user is not an admin', async () => {
    const token = 'valid-user-token';
    const req = { cookies: { get: jest.fn().mockReturnValue({ value: token }) } } as unknown as NextRequest;
    
    process.env.TOKEN_SECRET = mockJwtSecretKey;
    (jwtVerify as jest.Mock).mockResolvedValue({ payload: mockInvalidPayload });
    
    const result = await verifyAdmin(req);
    expect(result).toEqual(NextResponse.json({ status: 403, message: "Forbidden" }));
  });

  it('should return 403 if token verification fails', async () => {
    const token = 'invalid-token';
    const req = { cookies: { get: jest.fn().mockReturnValue({ value: token }) } } as unknown as NextRequest;
    
    (jwtVerify as jest.Mock).mockRejectedValue(new Error('Invalid token'));
    
    const result = await verifyAdmin(req);
    expect(result).toEqual(NextResponse.json({ status: 403, message: "Forbidden" }));
  });
});

describe('verifyUser', () => {
  it('should return payload if the token is valid', async () => {
    const token = 'valid-user-token';
    const req = { cookies: { get: jest.fn().mockReturnValue({ value: token }) } } as unknown as NextRequest;
    
    process.env.TOKEN_SECRET = mockJwtSecretKey;
    (jwtVerify as jest.Mock).mockResolvedValue({ payload: mockValidPayload });
    
    const result = await verifyUser(req);
    expect(result).toEqual(mockValidPayload);
  });

  it('should return 401 if no token is provided', async () => {
    const req = { cookies: { get: jest.fn().mockReturnValue(undefined) } } as unknown as NextRequest;
    
    const result = await verifyUser(req);
    expect(result).toEqual(NextResponse.json({ status: 401, message: "Unauthorized" }));
  });

  it('should return 403 if token verification fails', async () => {
    const token = 'invalid-token';
    const req = { cookies: { get: jest.fn().mockReturnValue({ value: token }) } } as unknown as NextRequest;
    
    (jwtVerify as jest.Mock).mockRejectedValue(new Error('Invalid token'));
    
    const result = await verifyUser(req);
    expect(result).toEqual(NextResponse.json({ status: 403, message: "Forbidden" }));
  });
});
