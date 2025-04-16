import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';

export async function GET() {
  try {
    // Информация о переменных окружения (без паролей)
    const envInfo = {
      MONGODB_URI: process.env.MONGODB_URI ? 'Настроен' : 'Не настроен',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Настроен' : 'Не настроен',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NODE_ENV: process.env.NODE_ENV,
    };

    // Проверка соединения с базой данных
    const conn = await dbConnect();
    
    // Получение информации о соединении
    const dbStatus = {
      isConnected: mongoose.connection.readyState === 1,
      readyState: mongoose.connection.readyState,
      // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
      readyStateText: ['Отключено', 'Подключено', 'Подключение...', 'Отключение...'][
        mongoose.connection.readyState
      ],
      db: mongoose.connection.db?.databaseName || 'Нет подключения',
      collections: mongoose.connection.db 
        ? await mongoose.connection.db.listCollections().toArray()
        : [],
    };

    // Проверка моделей
    const models = Object.keys(mongoose.models).map(name => {
      const model = mongoose.models[name];
      return {
        name,
        collectionName: model.collection.name,
        schema: {
          paths: Object.keys(model.schema.paths),
        }
      };
    });

    return NextResponse.json({
      environment: envInfo,
      database: dbStatus,
      models,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Ошибка в отладочном API:', error);
    return NextResponse.json({
      error: 'Ошибка при получении отладочной информации',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 