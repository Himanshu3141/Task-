import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    bio: { type: String, default: "" },
  },
  { timestamps: true }
);

export const User =
  models.User || mongoose.model("User", UserSchema);


