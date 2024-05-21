import mongoose, { Schema, model, Document } from 'mongoose';

interface IRating extends Document {
  fromUserId: string;
  toUserId: string;
  score: number;
}

const ratingSchema:Schema = new Schema({
  fromUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  toUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true, min: 1, max: 10 }
});

export default mongoose.model<IRating>('Rating', ratingSchema);

