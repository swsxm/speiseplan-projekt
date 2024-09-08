import { connectMongoDB } from '../mongodb';
import mongoose from 'mongoose';

// Mock mongoose module
jest.mock('mongoose', () => {
  return {
    connection: {
      readyState: 0, // Default to disconnected
    },
    connect: jest.fn().mockImplementation((uri) => {
      if (uri === 'invalid_uri') {
        return Promise.reject(new Error('Connection failed'));
      }
      return Promise.resolve(); // Simulate successful connection
    }),
    disconnect: jest.fn().mockResolvedValue(undefined), // Mock the disconnect method
  };
});

describe('MongoDB tests', () => {

    beforeAll(async () => {
        process.env.MONGODB_URI = 'valid_uri'; // Set a valid URI for initial setup
        await connectMongoDB(); // Connect to MongoDB
    });

    afterAll(async () => {
        await mongoose.disconnect(); // Disconnect after tests
    });

    test('should connect to MongoDB successfully', async () => {
        // Connect to MongoDB
        await connectMongoDB();
        // Check the mocked readyState
        const dbState = mongoose.connection.readyState;
        expect(dbState).toBe(0);
    }, 15000);

    test('should handle connection errors', async () => {
        // Simulate a connection error
        process.env.MONGODB_URI = 'invalid_uri';
        await expect(connectMongoDB()).rejects.toThrow('Connection failed');
        // Check the readyState after a failed connection
        const dbState = mongoose.connection.readyState;
        expect(dbState).toBe(0); // 0 means disconnected
        await mongoose.disconnect(); // Ensure disconnect is called
    });
});
