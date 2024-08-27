import { connectMongoDB } from '../mongodb';
import mongoose from 'mongoose';

describe('MongoDB tests', () => {

    beforeAll(async () => {
        process.env.MONGODB_URI = process.env.MONGODB_URI;
    });


    test('should connect to MongoDB successfully', async () => {
        await expect(connectMongoDB()).resolves.toBeUndefined();
        const dbState = mongoose.connection.readyState;
        expect(dbState).toBe(1); // 1 means connected
        mongoose.disconnect()
    });
    test('should handle connection errors', async () => {
        process.env.MONGODB_URI = 'invalid_uri';
        await expect(connectMongoDB()).resolves.toBeUndefined();
        const dbState = mongoose.connection.readyState;
        expect(dbState).toBe(0); // 0 means disconnected
        mongoose.disconnect()
    });
});