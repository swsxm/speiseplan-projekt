import { connectMongoDB } from '../mongodb';
import mongoose from 'mongoose';

describe('MongoDB tests', () => {

    beforeAll(async () => {
        process.env.MONGODB_URI = process.env.MONGODB_URI;
        await mongoose.disconnect();
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    test('should connect to MongoDB successfully', async () => {
        await expect(connectMongoDB()).resolves.toBeUndefined();
        const dbState = mongoose.connection.readyState;
        expect(dbState).toBe(1); // 1 means connected
        await mongoose.disconnect();
    }, 15000);

    test('should handle connection errors', async () => {
        process.env.MONGODB_URI = 'invalid_uri';
        await expect(connectMongoDB()).rejects.toThrow(); 
        const dbState = mongoose.connection.readyState;
        expect(dbState).toBe(0); // 0 means disconnected
        await mongoose.disconnect();
    });
});
