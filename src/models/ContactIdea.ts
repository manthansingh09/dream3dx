import mongoose, { Schema, Document } from "mongoose";

export interface IContactIdea extends Document {
  name: string;
  email: string;
  type: "Idea" | "Contact";
  message: string;
  createdAt: Date;
}

const ContactIdeaSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  type: { type: String, enum: ["Idea", "Contact"], required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.ContactIdea || mongoose.model<IContactIdea>("ContactIdea", ContactIdeaSchema);
