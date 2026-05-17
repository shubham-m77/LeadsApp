import mongoose, { Document, Schema, Types } from "mongoose";
import { LeadStatus,LeadSource } from "../types/leads.types";
export interface ILeadDoc extends Document{
    name:string,
    email:string,
    status:LeadStatus,
    source:LeadSource,
    createdAt:Date,
    updateAt:Date,
    createdBy:Types.ObjectId
}

const leadSchema = new Schema<ILeadDocument>(
  {
    name: {
      type: String,
      required: [true, "Lead name is required"],
    },
    email: {
      type: String,
      required: [true, "Lead email is required"],
      lowercase: true
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Lost"],
      default: "New"
    },
    source: {
      type: String,
      enum: ["Website", "Instagram", "Referral"],
      required: [true, "Lead source is required"]
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

leadSchema.index({ name: "text", email: "text" });

export const Lead = mongoose.model<ILeadDoc>("Lead", leadSchema);