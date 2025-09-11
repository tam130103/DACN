import mongoose from 'mongoose';

export const connectDB = () => {
  const uri = process.env.MONGODB_URI || process.env.MONGODB_URL; // chấp nhận cả 2 tên
  if (!uri) {
    throw new Error('Missing MONGODB_URI (or MONGODB_URL) in environment');
  }

  // Timeout để tránh treo deploy khi DB chưa sẵn sàng
  return mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    // các option tùy chọn thêm:
    // maxPoolSize: 10,
    // retryWrites: true,
    // w: 'majority'
  });
};