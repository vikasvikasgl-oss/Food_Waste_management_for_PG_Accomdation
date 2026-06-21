import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['resident', 'manager'], required: true },
  password: { type: String, required: true }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
