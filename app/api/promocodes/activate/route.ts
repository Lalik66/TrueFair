import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/mongodb';
import PromoCode from '@/models/PromoCode';
import UserCourseAccess from '@/models/UserCourseAccess';
import Course from '@/models/Course';

export async function POST(req: NextRequest) {
  try {
    // Проверяем, авторизован ли пользователь
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Вы должны быть авторизованы' },
        { status: 401 }
      );
    }

    // Подключаемся к MongoDB
    await dbConnect();

    // Получаем данные из запроса
    const data = await req.json();
    const { code, courseId } = data;

    if (!code || !courseId) {
      return NextResponse.json(
        { error: 'Необходимо указать промокод и ID курса' },
        { status: 400 }
      );
    }

    // Ищем промокод в базе данных
    const promoCode = await PromoCode.findOne({
      code: code.toUpperCase(),
      courseId,
      isActive: true,
    });

    if (!promoCode) {
      return NextResponse.json(
        { error: 'Промокод не найден или недействителен' },
        { status: 404 }
      );
    }

    // Проверяем, не истек ли срок действия промокода
    if (promoCode.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Срок действия промокода истек' },
        { status: 400 }
      );
    }

    // Проверяем, не превышено ли максимальное количество использований
    if (promoCode.maxUses !== -1 && promoCode.usedCount >= promoCode.maxUses) {
      return NextResponse.json(
        { error: 'Достигнуто максимальное количество использований промокода' },
        { status: 400 }
      );
    }

    // Проверяем, существует ли курс
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json(
        { error: 'Курс не найден' },
        { status: 404 }
      );
    }

    // Проверяем, есть ли у пользователя уже доступ к курсу
    const existingAccess = await UserCourseAccess.findOne({
      userId: session.user.id,
      courseId,
    });

    if (existingAccess) {
      return NextResponse.json(
        { message: 'У вас уже есть доступ к этому курсу' },
        { status: 200 }
      );
    }

    // Создаем запись о доступе к курсу
    await UserCourseAccess.create({
      userId: session.user.id,
      courseId,
      promoCodeId: promoCode._id,
      grantedAt: new Date(),
      lastAccessed: new Date(),
      progress: [],
    });

    // Увеличиваем счетчик использований промокода
    promoCode.usedCount += 1;
    await promoCode.save();

    return NextResponse.json(
      {
        message: 'Промокод успешно активирован',
        courseId,
        title: course.title,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при активации промокода:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при активации промокода' },
      { status: 500 }
    );
  }
} 