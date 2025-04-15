import mongoose from 'mongoose';

export interface IPromoCode {
  _id: string;
  code: string;
  courseId: mongoose.Types.ObjectId;
  expiresAt: Date;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  // Виртуальные свойства
  isExpired?: boolean;
  isMaxUsesReached?: boolean;
  isValid?: boolean;
}

const PromoCodeSchema = new mongoose.Schema<IPromoCode>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    } as any,
    expiresAt: {
      type: Date,
      required: true,
    },
    maxUses: {
      type: Number,
      default: -1, // -1 означает неограниченное использование
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Создаем виртуальное свойство для проверки истечения срока действия
PromoCodeSchema.virtual('isExpired').get(function() {
  return new Date() > this.expiresAt;
});

// Создаем виртуальное свойство для проверки максимального количества использований
PromoCodeSchema.virtual('isMaxUsesReached').get(function() {
  return this.maxUses !== -1 && this.usedCount >= this.maxUses;
});

// Создаем виртуальное свойство для проверки валидности промокода
PromoCodeSchema.virtual('isValid').get(function() {
  return this.isActive && !this.isExpired && !this.isMaxUsesReached;
});

export default mongoose.models.PromoCode || mongoose.model<IPromoCode>('PromoCode', PromoCodeSchema); 