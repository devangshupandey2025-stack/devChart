import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let cached = (global as any).mongooseConnection as {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
} | undefined;

if (!cached) {
    cached = (global as any).mongooseConnection = { conn: null, promise: null };
}

async function connectDB() {
    if (!MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined");
    }

    if (cached!.conn) {
        return cached!.conn;
    }

    if (!cached!.promise) {
        cached!.promise = mongoose.connect(MONGODB_URI).then((m) => {
            console.log("MongoDB connected successfully");
            return m;
        });
    }

    try {
        cached!.conn = await cached!.promise;
    } catch (error) {
        cached!.promise = null;
        throw error;
    }

    return cached!.conn;
}

export default connectDB;