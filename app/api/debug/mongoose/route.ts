import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerConfig } from '@/lib/config';

export async function GET() {
  try {
    // Проверяем текущее состояние соединения Mongoose
    const currentState = mongoose.connection.readyState;
    const stateMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
      99: 'uninitialized'
    };

    const connectionState = stateMap[currentState as keyof typeof stateMap] || `unknown (${currentState})`;
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      return NextResponse.json({
        success: false,
        error: 'MongoDB URI не найден в переменных окружения',
        environment: process.env.NODE_ENV,
        mongooseState: connectionState
      });
    }

    // Маскируем пароль в URI для вывода в ответе
    const sanitizedUri = mongoUri.replace(
      /mongodb(\+srv)?:\/\/[^:]+:([^@]+)@/,
      'mongodb$1://[username]:[masked]@'
    );

    // Если соединение уже установлено, получаем информацию о нем
    if (currentState === 1) {
      console.log('Mongoose connection already established');
      
      // Получаем информацию о моделях
      const modelNames = Object.keys(mongoose.models);
      
      return NextResponse.json({
        success: true,
        message: 'Mongoose уже подключен к MongoDB',
        mongooseState: connectionState,
        models: modelNames,
        uri: sanitizedUri,
        environment: process.env.NODE_ENV,
        hostname: process.env.HOSTNAME || 'unknown'
      });
    }

    console.log('Attempting to connect to MongoDB via Mongoose...');
    
    // Если не подключен, пробуем установить соединение
    if (currentState !== 1) {
      // Сначала закрываем существующее соединение, если оно в процессе
      if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
        console.log('Existing Mongoose connection closed');
      }
      
      // Установка таймаута
      mongoose.set('connectTimeoutMS', 10000);
      
      // Попытка подключения через функцию из серверного конфига
      const config = getServerConfig();
      await config.dbConnect();
      
      console.log('Mongoose connection established');
    }

    // Получаем информацию о моделях после подключения
    const modelNames = Object.keys(mongoose.models);

    return NextResponse.json({
      success: true,
      message: 'Успешное соединение с MongoDB через Mongoose',
      previousState: stateMap[currentState as keyof typeof stateMap],
      currentState: stateMap[mongoose.connection.readyState as keyof typeof stateMap],
      models: modelNames,
      uri: sanitizedUri,
      environment: process.env.NODE_ENV,
      hostname: process.env.HOSTNAME || 'unknown'
    });
  } catch (error) {
    console.error('Mongoose connection error:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Неизвестная ошибка при подключении к MongoDB через Mongoose';
      
    return NextResponse.json({
      success: false,
      error: errorMessage,
      stack: process.env.NODE_ENV === 'development' && error instanceof Error 
        ? error.stack 
        : undefined,
      mongooseState: stateMap[mongoose.connection.readyState as keyof typeof stateMap] || 'unknown',
      uri: process.env.MONGODB_URI 
        ? process.env.MONGODB_URI.replace(/mongodb(\+srv)?:\/\/[^:]+:([^@]+)@/, 'mongodb$1://[username]:[masked]@')
        : undefined,
      environment: process.env.NODE_ENV
    });
  }
} 