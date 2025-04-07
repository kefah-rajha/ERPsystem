import { Schema, model, connect } from 'mongoose';
interface categoryType {
name:string;
slug:string;
parent:Schema.Types.ObjectId;
children:[Schema.Types.ObjectId];
mainCategory:boolean

    
}

const categorySchema = new Schema<categoryType>({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  children: [{
    type: Schema.Types.ObjectId,
    ref: 'Category',
  }],
  mainCategory: {
    type: Boolean,
    required: true,
  },

});

export const Category = model<categoryType>('Category', categorySchema);