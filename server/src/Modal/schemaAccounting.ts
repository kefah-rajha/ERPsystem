import mongoose, { Schema, Document, Model, HydratedDocument } from 'mongoose';

interface IAccount {
  name: string;
  amount: number;
  withdrawals: number;
  deposits: number;
  createdAt: Date;
  completedOperations: number;
  pendingOperations: number;
  remainingOperationsValue: number;
  creator: string;
}

type IAccountDocument = HydratedDocument<IAccount>;

const accountSchema: Schema<IAccountDocument> = new mongoose.Schema<IAccountDocument>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  withdrawals: {
    type: Number,
    default: 0,
  },
  deposits: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completedOperations: {
    type: Number,
    default: 0,
  },
  pendingOperations: {
    type: Number,
    default: 0,
  },
  remainingOperationsValue: {
    type: Number,
    default: 0,
  },
  creator: {
    type: String,
    required: true,
    trim: true,
  },
});

export const accounModel: Model<IAccountDocument> = mongoose.model<IAccountDocument>('Account', accountSchema);

