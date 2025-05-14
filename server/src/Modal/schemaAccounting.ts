import mongoose, { Schema, Document, Model, HydratedDocument } from 'mongoose';
interface salesOrder{
  _id:string;
  orderNumber:string;
  amount:number;
  status:string ;
}

interface purchaseOrder{
  _id:string;
  orderNumber:string;
  amount:number;
  status:string ;
}

interface IAccount {
  name: string;
  initalAmount: number;
  amount: number;
  withdrawals: number;
  deposits: number;
  createdAt: Date;
  completedOperations: number;
  pendingOperations: number;
  remainingOperationsValue: number;
  creator: string;
  salesOrder:salesOrder[],
  purchaseOrder:purchaseOrder[]
}

type IAccountDocument = HydratedDocument<IAccount>;
const salesOrderSchema: Schema<salesOrder> = new mongoose.Schema<salesOrder>({
  _id: { type: String },
  orderNumber: { type: String },
  amount: { type: Number },
  status: { type: String },
})
const purchaseOrderSchema: Schema<purchaseOrder> = new mongoose.Schema<purchaseOrder>({
  _id: { type: String },
  orderNumber: { type: String },
  amount: { type: Number },
  status: { type: String },
})
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
  initalAmount:{
    type: Number,
    required: true,
    default: 0
  },
  salesOrder:[salesOrderSchema],
  purchaseOrder:[purchaseOrderSchema],
});

export const accounModel: Model<IAccountDocument> = mongoose.model<IAccountDocument>('Account', accountSchema);

