import mongoose from 'mongoose';

export interface IUserCourseAccess {
  _id: string;
  userId: string;
  courseId: string;
  promoCodeId: string;
  grantedAt: Date;
  lastAccessed: Date;
  progress: {
    lessonId: string;
    completed: boolean;
    lastViewedAt: Date;
    watchTimeSeconds: number;
  }[];
}

const UserCourseAccessSchema = new mongoose.Schema<IUserCourseAccess>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    promoCodeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PromoCode',
      required: true,
    },
    grantedAt: {
      type: Date,
      default: Date.now,
    },
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
    progress: [
      {
        lessonId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Lesson',
        },
        completed: {
          type: Boolean,
          default: false,
        },
        lastViewedAt: {
          type: Date,
          default: Date.now,
        },
        watchTimeSeconds: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Создаем составной индекс для уникальной пары пользователь-курс
UserCourseAccessSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.models.UserCourseAccess ||
  mongoose.model<IUserCourseAccess>('UserCourseAccess', UserCourseAccessSchema); 