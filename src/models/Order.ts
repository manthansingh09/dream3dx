import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  userEmail: string;
  customerName: string;
  phoneNumber: string;
  shippingAddress: string;
  orderType: string;
  referenceId: string;
  fileUrl: string;
  volumeOrSize: number;
  amount: number;
  currency: string;
  paymentId?: string;
  status: "Pending" | "Paid" | "Printing" | "Shipped" | "Delivered";
  deliverySpeed: "Same Day" | "Next Day" | "Standard";
  createdAt: Date;
}

const OrderSchema: Schema = new Schema({
  userEmail: { type: String, required: true },
  customerName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  shippingAddress: { type: String, required: true },
  orderType: { type: String, required: true },
  referenceId: { type: String, required: true, unique: true },
  fileUrl: { type: String, required: true },
  volumeOrSize: { type: Number, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  paymentId: { type: String },
  status: { 
    type: String, 
    enum: ["Pending", "Paid", "Printing", "Shipped", "Delivered"], 
    default: "Pending" 
  },
  deliverySpeed: { 
    type: String, 
    enum: ["Same Day", "Next Day", "Standard"], 
    default: "Standard" 
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
