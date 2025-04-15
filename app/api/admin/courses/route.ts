import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    // Проверяем авторизацию и права администратора
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      );
    }

    // Подключаемся к MongoDB
    await dbConnect();

    // Проверяем, имеет ли пользователь права администратора
    const user = await User.findOne({ email: session.user.email });
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'У вас нет прав для выполнения этого действия' },
        { status: 403 }
      );
    }

    // Получаем данные из запроса
    const data = await req.json();
    
    // Проверяем обязательные поля
    if (!data.title || !data.description || !data.thumbnailUrl) {
      return NextResponse.json(
        { error: 'Не указаны обязательные поля курса' },
        { status: 400 }
      );
    }

    // Проверяем уроки
    if (!data.lessons || !Array.isArray(data.lessons) || data.lessons.length === 0) {
      return NextResponse.json(
        { error: 'Курс должен содержать как минимум один урок' },
        { status: 400 }
      );
    }

    // Проверяем, что у всех уроков есть необходимые данные и YouTube ID
    for (const lesson of data.lessons) {
      if (!lesson.title || !lesson.description || !lesson.youtubeVideoId) {
        return NextResponse.json(
          { error: 'Все уроки должны иметь название, описание и ID YouTube видео' },
          { status: 400 }
        );
      }
    }

    // Создаем новый курс
    const course = await Course.create({
      title: data.title,
      description: data.description,
      thumbnailUrl: data.thumbnailUrl,
      categories: data.categories || [],
      tags: data.tags || [],
      lessons: data.lessons.map((lesson: any) => ({
        title: lesson.title,
        description: lesson.description,
        youtubeVideoId: lesson.youtubeVideoId,
        duration: lesson.duration || 0,
        order: lesson.order || 1,
        materials: lesson.materials || [],
      })),
      isPublished: data.isPublished !== undefined ? data.isPublished : true,
    });

    return NextResponse.json(
      { message: 'Курс успешно создан', courseId: course._id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Ошибка при создании курса:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при создании курса' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Проверяем авторизацию
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      );
    }

    // Подключаемся к MongoDB
    await dbConnect();

    // Проверяем, имеет ли пользователь права администратора
    const user = await User.findOne({ email: session.user.email });
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'У вас нет прав для выполнения этого действия' },
        { status: 403 }
      );
    }

    // Получаем параметры запроса
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    // Получаем общее количество курсов
    const total = await Course.countDocuments();

    // Получаем список курсов с пагинацией
    const courses = await Course.find()
      .select('title description thumbnailUrl categories tags isPublished createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json(
      {
        courses,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при получении списка курсов:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при получении списка курсов' },
      { status: 500 }
    );
  }
} 