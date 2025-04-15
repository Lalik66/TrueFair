import mongoose from 'mongoose';

export interface IUserCourseAccess {
  _id: string;
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  promoCodeId: mongoose.Types.ObjectId;
  grantedAt: Date;
  lastAccessed: Date;
  progress: {
    lessonId: mongoose.Types.ObjectId;
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
    } as any,
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    } as any,
    promoCodeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PromoCode',
      required: true,
    } as any,
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
        } as any,
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