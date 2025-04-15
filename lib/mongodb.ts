import mongoose from 'mongoose';

// Проверка наличия переменной окружения MONGODB_URI
if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const MONGODB_URI = process.env.MONGODB_URI;

// Логирование строки подключения (без пароля)
const sanitizedUri = MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//[USERNAME]:[PASSWORD]@');
console.log(`MongoDB URI (sanitized): ${sanitizedUri}`);

// Тип для кеша mongoose соединения
interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Объявление глобальной переменной
declare global {
  var mongoose: MongooseConnection | undefined;
}

// Кеш для соединения с MongoDB
let cached: MongooseConnection = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function dbConnect() {
  if (cached.conn) {
    console.log('Используется существующее подключение к MongoDB');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // Дополнительные настройки для надежного подключения
      connectTimeoutMS: 30000, // 30 секунд на подключение
      socketTimeoutMS: 45000, // 45 секунд на операции сокета
      maxPoolSize: 10, // Максимальное количество соединений в пуле
      minPoolSize: 1, // Минимальное количество соединений в пуле
    };

    console.log('Создание нового подключения к MongoDB...');
    try {
      cached.promise = mongoose.connect(MONGODB_URI, opts);
    } catch (err: any) {
      console.error('Ошибка при создании подключения к MongoDB:', err.message);
      throw err;
    }
  } else {
    console.log('Используется существующий промис подключения к MongoDB');
  }

  try {
    console.log('Ожидание подключения к MongoDB...');
    cached.conn = await cached.promise;
    console.log('Подключение к MongoDB успешно установлено!');
    console.log(`База данных: ${mongoose.connection.db?.databaseName || 'неизвестно'}`);
    console.log(`Статус подключения: ${mongoose.connection.readyState}`);
    return cached.conn;
  } catch (e: any) {
    console.error('Ошибка при ожидании подключения к MongoDB:', e);
    // Сбрасываем промис, чтобы при следующем вызове можно было повторить попытку
    cached.promise = null;
    throw e;
  }
}

// Обработчик событий соединения
mongoose.connection.on('connected', () => {
  console.log('MongoDB подключена.');
});

mongoose.connection.on('error', (err) => {
  console.error('Ошибка соединения MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB отключена.');
});

// Обработка сигналов завершения процесса
const gracefulShutdown = () => {
  mongoose.connection.close(() => {
    console.log('MongoDB соединение закрыто по завершению приложения');
    process.exit(0);
  });
};

// Отслеживаем завершение процесса только на стороне сервера
if (typeof process !== 'undefined') {
  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);
}

export default dbConnect; 