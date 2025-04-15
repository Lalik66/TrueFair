import mongoose from 'mongoose';

export interface ILesson {
  title: string;
  description: string;
  youtubeVideoId: string;
  duration: number;
  order: number;
  materials: {
    title: string;
    fileUrl: string;
    fileType: string;
  }[];
}

export interface ICourse {
  _id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  categories: string[];
  tags: string[];
  lessons: ILesson[];
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
}

const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  youtubeVideoId: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  materials: [
    {
      title: String,
      fileUrl: String,
      fileType: String,
    },
  ],
});

const CourseSchema = new mongoose.Schema<ICourse>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    categories: [String],
    tags: [String],
    lessons: [LessonSchema],
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema); 