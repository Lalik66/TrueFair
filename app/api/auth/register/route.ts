import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    console.log('Начало обработки запроса на регистрацию');
    const { firstName, lastName, email, password } = await req.json();
    console.log('Получены данные:', { firstName, lastName, email, passwordLength: password?.length });

    // Проверка наличия всех полей
    if (!firstName || !lastName || !email || !password) {
      console.log('Ошибка: не все поля заполнены');
      return NextResponse.json(
        { error: 'Все поля обязательны для заполнения' },
        { status: 400 }
      );
    }

    // Проверка длины пароля
    if (password.length < 6) {
      console.log('Ошибка: пароль слишком короткий');
      return NextResponse.json(
        { error: 'Пароль должен содержать не менее 6 символов' },
        { status: 400 }
      );
    }

    console.log('Подключение к базе данных...');
    await dbConnect();
    console.log('Подключение к базе данных успешно');

    // Проверка, существует ли пользователь с таким email
    console.log('Проверка существующего пользователя с email:', email.toLowerCase());
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('Пользователь с таким email уже существует');
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 409 }
      );
    }

    // Хеширование пароля
    console.log('Хеширование пароля...');
    const passwordHash = await bcrypt.hash(password, 10);
    console.log('Пароль успешно хеширован');

    // Создание нового пользователя
    console.log('Создание нового пользователя...');
    const userData = {
      firstName,
      lastName,
      email: email.toLowerCase(),
      passwordHash,
      role: 'user',
      registeredAt: new Date(),
      savedCourses: [],
      favoriteCourses: [],
      lastLogin: new Date()
    };
    console.log('Данные для создания пользователя:', userData);
    
    const user = await User.create(userData);
    console.log('Пользователь успешно создан с ID:', user._id);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Ошибка при регистрации пользователя:', error);
    console.error('Детали ошибки:', error.message);
    if (error.name === 'ValidationError') {
      console.error('Ошибка валидации mongoose:', JSON.stringify(error.errors));
    }
    if (error.code === 11000) {
      console.error('Ошибка дубликата ключа:', error.keyValue);
    }
    
    return NextResponse.json(
      { error: `Произошла ошибка при регистрации: ${error.message}` },
      { status: 500 }
    );
  }
} 