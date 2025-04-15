import mongoose from 'mongoose';

export interface IUser {
  _id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  savedCourses: mongoose.Types.ObjectId[];
  favoriteCourses: mongoose.Types.ObjectId[];
  registrationDate: Date;
  lastLogin: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

// При инициализации модели создадим логирование
console.log('Инициализация модели User');

const UserSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email обязателен'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Пароль обязателен'],
    },
    firstName: {
      type: String,
      required: [true, 'Имя обязательно'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Фамилия обязательна'],
      trim: true,
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: 'Роль должна быть "user" или "admin"'
      },
      default: 'user',
    },
    savedCourses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      default: [],
    }],
    favoriteCourses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      default: [],
    }],
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  }
);

// Логирование при попытке создания модели
console.log('Проверка существующей модели User:', mongoose.models.User ? 'Существует' : 'Не существует');

// Экспортируем модель с дополнительной проверкой для избежания ошибок повторного определения
const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

console.log('Модель User успешно инициализирована');

export default UserModel; 