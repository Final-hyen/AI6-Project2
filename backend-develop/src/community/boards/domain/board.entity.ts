import mongoose from 'mongoose';

const Board = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    participantInfo: {
      totalCount: {
        type: Number,
      },
      currentCount: {
        type: Number,
        default: 1,
      },
      userIdList: [
        {
          type: String,
        },
      ],
    },
    authorId: {
      type: String,
      required: true,
    },
    userId:{ type:String},
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
    collection: 'boards',
    timestamps: true,
  },
);

export interface BoardsTypes {
  _id: mongoose.Types.ObjectId;
  title: string;
  content: string;
  authorId?: string;
  participantInfo: {
    totalCount: number;
    currentCount: number;
    userIdList: string[];
  };
  userId?:string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  isDeleted?: boolean;
}
export const Boards = mongoose.model<BoardsTypes>('boards', Board);
