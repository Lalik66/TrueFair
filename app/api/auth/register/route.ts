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

    // Логирование информации о подключении к MongoDB (без пароля)
    const mongoUri = process.env.MONGODB_URI || '';
    const sanitizedUri = mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//[USERNAME]:[PASSWORD]@');
    console.log('Подключение к MongoDB:', sanitizedUri);

    console.log('Подключение к базе данных...');
    try {
      await dbConnect();
      console.log('Подключение к базе данных успешно');
    } catch (dbError: any) {
      console.error('Ошибка подключения к базе данных:', dbError.message);
      return NextResponse.json(
        { error: `Ошибка подключения к базе данных: ${dbError.message}` },
        { status: 500 }
      );
    }

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
      registrationDate: new Date(),
      savedCourses: [],
      favoriteCourses: [],
      lastLogin: new Date()
    };
    console.log('Данные для создания пользователя:', JSON.stringify(userData));
    
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
    console.error('Тип ошибки:', error.name);
    console.error('Стек ошибки:', error.stack);

    if (error.name === 'ValidationError') {
      console.error('Ошибка валидации mongoose:', JSON.stringify(error.errors));
      return NextResponse.json(
        { error: `Ошибка валидации: ${Object.values(error.errors).map((e: any) => e.message).join(', ')}` },
        { status: 400 }
      );
    }
    
    if (error.code === 11000) {
      console.error('Ошибка дубликата ключа:', error.keyValue);
      return NextResponse.json(
        { error: `Пользователь с таким ${Object.keys(error.keyValue)[0]} уже существует` },
        { status: 409 }
      );
    }

    // Ошибки подключения к MongoDB
    if (error.name === 'MongoServerError') {
      console.error('Ошибка сервера MongoDB:', error.message);
      return NextResponse.json(
        { error: `Ошибка базы данных: ${error.message}` },
        { status: 500 }
      );
    }

    if (error.name === 'MongoNetworkError') {
      console.error('Ошибка сети MongoDB:', error.message);
      return NextResponse.json(
        { error: `Ошибка сети при подключении к базе данных: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: `Произошла ошибка при регистрации: ${error.message}` },
      { status: 500 }
    );
  }
} 