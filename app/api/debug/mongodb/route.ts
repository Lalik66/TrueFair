import { NextResponse } from 'next/server';
import { MongoClient, MongoClientOptions } from 'mongodb';

export async function GET() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      return NextResponse.json({
        success: false,
        error: 'MongoDB URI не найден в переменных окружения',
        environment: process.env.NODE_ENV
      });
    }

    // Маскируем пароль в URI для вывода в ответе
    const sanitizedUri = mongoUri.replace(
      /mongodb(\+srv)?:\/\/[^:]+:([^@]+)@/,
      'mongodb$1://[username]:[masked]@'
    );

    const options: MongoClientOptions = {
      connectTimeoutMS: 10000, // 10 секунд таймаут соединения
    };

    console.log('Attempting to connect to MongoDB...');
    const client = new MongoClient(mongoUri, options);
    await client.connect();
    console.log('MongoDB connection established');

    // Получаем информацию о сервере и БД
    const adminDb = client.db().admin();
    const serverInfo = await adminDb.serverInfo();
    const databaseInfo = await adminDb.listDatabases();
    
    // Получаем список коллекций текущей БД
    const dbName = mongoUri.split('/').pop()?.split('?')[0] || 'unknown';
    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(collection => collection.name);

    await client.close();
    console.log('MongoDB connection closed');

    return NextResponse.json({
      success: true,
      message: 'Успешное соединение с MongoDB',
      serverInfo: {
        version: serverInfo.version,
        gitVersion: serverInfo.gitVersion,
        modules: serverInfo.modules,
        sysInfo: serverInfo.sysInfo
      },
      databases: databaseInfo.databases.map(db => ({
        name: db.name,
        sizeOnDisk: db.sizeOnDisk,
        empty: db.empty
      })),
      currentDatabase: {
        name: dbName,
        collections: collectionNames
      },
      uri: sanitizedUri,
      environment: process.env.NODE_ENV,
      hostname: process.env.HOSTNAME || 'unknown'
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Неизвестная ошибка при подключении к MongoDB';
      
    return NextResponse.json({
      success: false,
      error: errorMessage,
      stack: process.env.NODE_ENV === 'development' && error instanceof Error 
        ? error.stack 
        : undefined,
      uri: process.env.MONGODB_URI 
        ? process.env.MONGODB_URI.replace(/mongodb(\+srv)?:\/\/[^:]+:([^@]+)@/, 'mongodb$1://[username]:[masked]@')
        : undefined,
      environment: process.env.NODE_ENV
    });
  }
} 