# TrueMap

Образовательная веб-платформа для размещения видеоуроков с современным минималистичным дизайном в темно-белой цветовой гамме.

## Технологии

- Frontend: React с TypeScript, Next.js
- Backend: Next.js API Routes
- База данных: MongoDB
- Хостинг: Render
- Хранение видео: AWS S3

## Локальная разработка

1. Клонируйте репозиторий
```bash
git clone https://github.com/yourusername/TrueMap.git
cd TrueMap
```

2. Установите зависимости
```bash
npm install
```

3. Создайте файл `.env.local` и заполните переменные окружения:
```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
S3_ACCESS_KEY=your_s3_access_key
S3_SECRET_KEY=your_s3_secret_key
S3_BUCKET_NAME=your_s3_bucket_name
S3_REGION=your_s3_region
```

4. Запустите приложение в режиме разработки
```bash
npm run dev
```

## Деплой на Render

1. Зарегистрируйтесь на [Render](https://render.com)

2. Создайте новый Web Service:
   - Подключите ваш GitHub репозиторий
   - Выберите тип "Node"
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

3. Добавьте переменные окружения:
   - `MONGODB_URI`: Ваша MongoDB URL
   - `NEXTAUTH_SECRET`: Секретный ключ для NextAuth
   - `NEXTAUTH_URL`: URL вашего приложения на Render
   - `S3_ACCESS_KEY`: Ключ доступа к S3
   - `S3_SECRET_KEY`: Секретный ключ S3
   - `S3_BUCKET_NAME`: Имя бакета S3
   - `S3_REGION`: Регион S3

4. Нажмите "Create Web Service"

## Структура MongoDB

База данных включает следующие коллекции:
- users: Информация о пользователях
- courses: Курсы с видеоуроками
- lessons: Отдельные уроки
- promocodes: Промокоды для доступа к курсам
- user_access: Записи о доступе пользователей к курсам 