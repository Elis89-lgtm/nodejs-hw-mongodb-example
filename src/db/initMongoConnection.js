import { getEnvVar } from '../utils/getEnvVar.js';

import mongoose from 'mongoose';

export const initMongoConnection = async () => {
  try {
    const user = getEnvVar('MONGODB_USER');
    const password = getEnvVar('MONGODB_PASSWORD');
    const host = getEnvVar('MONGODB_HOST');
    const db = getEnvVar('MONGODB_DATABASE');
    const uri = `mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}/${db}?retryWrites=true&w=majority&appName=Cluster0`;

    await mongoose.connect(uri);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log('Successfully connected to MongoDB!');
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  }
};
