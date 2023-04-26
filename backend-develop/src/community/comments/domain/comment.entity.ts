import mongoose from 'mongoose';

const Comment = new mongoose.Schema(
  {
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'boards',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    authorId: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      required: false,
    },
  },
  {
    collection: 'comments',
    timestamps: true,
  },
);

interface CommentsTypes {
  boardId: mongoose.Types.ObjectId;
  _id: mongoose.Types.ObjectId;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  isDeleted?: boolean;
}

export const Comments = mongoose.model<CommentsTypes>('comments', Comment);
