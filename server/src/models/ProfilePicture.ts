import mongoose, { Schema, Document } from 'mongoose';

export interface IProfilePicture extends Document {
  userId: mongoose.Types.ObjectId;
  data: Buffer;
  contentType: string;
  createdAt: Date;
  updatedAt: Date;
}

const profilePictureSchema = new Schema<IProfilePicture>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    data: {
      type: Buffer,
      required: true
    },
    contentType: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Index for faster lookups
profilePictureSchema.index({ userId: 1 });

export const ProfilePicture = mongoose.model<IProfilePicture>('ProfilePicture', profilePictureSchema); 