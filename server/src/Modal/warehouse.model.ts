import mongoose, { Document, Schema } from 'mongoose';

// Interface for Warehouse document
export interface IWarehouse extends Document {
  name: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    }
  };
  capacity: {
    totalSquareFeet: number;
    usedSquareFeet: number;
  };
  manager: {
    name: string;
    contactNumber: string;
    email: string;
  };
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Schema definition
const WarehouseSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  location: {
    address: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    zipCode: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    },
    coordinates: {
      latitude: {
        type: Number
      },
      longitude: {
        type: Number
      }
    }
  },
  capacity: {
    totalSquareFeet: {
      type: Number,
      required: true
    },
    usedSquareFeet: {
      type: Number,
      default: 0
    }
  },
  manager: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    }
  },
  features: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create and export model
export default mongoose.model<IWarehouse>('Warehouse', WarehouseSchema);