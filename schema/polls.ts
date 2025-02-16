import mongoose, { Document, Schema } from "mongoose";
import { z } from "zod";

export const pollValidationSchema = z.object({
  question: z.string().min(1, "Please add a question!"),
  options: z
    .array(z.string().min(1, "Option cannot be empty"))
    .min(4, "Please add at least four options!"),
  createdBy: z.string().min(1, "Please enter your name"),
  allowMultiple: z.boolean().default(false),
  votes: z
    .array(
      z.object({
        user: z.instanceof(mongoose.Types.ObjectId),
        optionIndex: z.number(),
        votedAt: z.date().default(() => new Date()),
      })
    )
    .default([]),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type TPoll = z.infer<typeof pollValidationSchema> & Document;

const pollSchema = new Schema<TPoll>(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
    },
    options: {
      type: [String],
      required: [true, "Options are required"],
      validate: {
        validator: (v: string[]) => v.length >= 4,
        message: "At least four options are required",
      },
    },
    createdBy: {
      type: String,
      required: [true, "Creator name is required"],
      trim: true,
    },
    allowMultiple: {
      type: Boolean,
      default: false,
    },
    votes: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        optionIndex: Number,
        votedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

pollSchema.index({ createdBy: 1, visibility: 1 });

const PollModel = mongoose.models.Poll || mongoose.model<TPoll>("Poll", pollSchema);

export default PollModel;