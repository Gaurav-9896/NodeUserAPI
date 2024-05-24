import mongoose, { Document, Schema } from 'mongoose';

export interface IAdmin extends Document {
  email: string;
  role: string;
}

const adminSchema:Schema = new Schema({
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true, default: 'admin' }
});

export const Admin = mongoose.model<IAdmin>('Admin', adminSchema);
