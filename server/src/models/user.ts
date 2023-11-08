import mongoose, { Schema } from 'mongoose';
import IUser from '../interfaces/user';

const UserSchema = new Schema({
  uid: { type: String, unique: true },
  name: { type: String },
});

export default mongoose.model<IUser>('User', UserSchema);
