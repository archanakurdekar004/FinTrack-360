import mongoose from 'mongoose';

/**
 * Establishes connection to MongoDB database using Mongoose.
 * Listens for connection events and handles errors gracefully.
 */
export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/fintrack360';

    const conn = await mongoose.connect(mongoURI, {
      // Modern mongoose options are set by default in Mongoose 6+
    });

    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    console.log(`[MongoDB] Database name: ${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB] Initial Connection Error: ${error.message}`);
    // Throw error so the server process fails to start
    throw error;
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Connection lost. Attempting reconnect...');
});

mongoose.connection.on('error', (err) => {
  console.error(`[MongoDB] Connection error event: ${err.message}`);
});

export default connectDB;
