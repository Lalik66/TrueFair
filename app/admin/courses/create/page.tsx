'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateCoursePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [categories, setCategories] = useState('');
  const [tags, setTags] = useState('');
  
  const [lessons, setLessons] = useState([
    { 
      title: '', 
      description: '', 
      youtubeVideoId: '', 
      duration: 0, 
      order: 1,
      materials: []
    }
  ]);

  const handleLessonChange = (index: number, field: string, value: string | number) => {
    const updatedLessons = [...lessons];
    updatedLessons[index] = { ...updatedLessons[index], [field]: value };
    setLessons(updatedLessons);
  };

  const addLesson = () => {
    setLessons([
      ...lessons, 
      { 
        title: '', 
        description: '', 
        youtubeVideoId: '', 
        duration: 0, 
        order: lessons.length + 1,
        materials: []
      }
    ]);
  };

  const removeLesson = (index: number) => {
    const updatedLessons = lessons.filter((_, i) => i !== index);
    // Обновляем порядок уроков
    updatedLessons.forEach((lesson, i) => {
      lesson.order = i + 1;
    });
    setLessons(updatedLessons);
  };

  const addMaterial = (lessonIndex: number) => {
    const updatedLessons = [...lessons];
    if (!updatedLessons[lessonIndex].materials) {
      updatedLessons[lessonIndex].materials = [];
    }
    
    updatedLessons[lessonIndex].materials.push({
      title: '',
      fileUrl: '',
      fileType: 'pdf'
    });
    
    setLessons(updatedLessons);
  };

  const handleMaterialChange = (lessonIndex: number, materialIndex: number, field: string, value: string) => {
    const updatedLessons = [...lessons];
    updatedLessons[lessonIndex].materials[materialIndex] = {
      ...updatedLessons[lessonIndex].materials[materialIndex],
      [field]: value
    };
    setLessons(updatedLessons);
  };

  const removeMaterial = (lessonIndex: number, materialIndex: number) => {
    const updatedLessons = [...lessons];
    updatedLessons[lessonIndex].materials = updatedLessons[lessonIndex].materials.filter(
      (_, i) => i !== materialIndex
    );
    setLessons(updatedLessons);
  };

  const getYouTubeDuration = async (videoId: string) => {
    try {
      // Здесь можно использовать YouTube API для получения продолжительности видео
      // В этом примере просто запрашиваем у пользователя ввести вручную
      return 0; // Временно возвращаем 0
    } catch (error) {
      console.error('Ошибка при получении длительности видео:', error);
      return 0;
    }
  };

  const extractYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleYouTubeUrlChange = async (index: number, url: string) => {
    const videoId = extractYouTubeId(url);
    if (videoId) {
      handleLessonChange(index, 'youtubeVideoId', videoId);
      
      // Автоматически получить продолжительность видео
      const duration = await getYouTubeDuration(videoId);
      handleLessonChange(index, 'duration', duration);
    } else {
      // Если пользователь ввел ID напрямую (не URL)
      if (url.length === 11) {
        handleLessonChange(index, 'youtubeVideoId', url);
        const duration = await getYouTubeDuration(url);
        handleLessonChange(index, 'duration', duration);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Подготавливаем данные для отправки
      const courseData = {
        title,
        description,
        thumbnailUrl,
        categories: categories.split(',').map(cat => cat.trim()),
        tags: tags.split(',').map(tag => tag.trim()),
        lessons: lessons.map(lesson => ({
          ...lesson,
          materials: lesson.materials || []
        })),
        isPublished: true
      };

      // Отправляем запрос на создание курса
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при создании курса');
      }

      // После успешного создания курса перенаправляем на страницу админ-панели
      router.push('/admin/courses');
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-8">Создание нового курса</h1>

        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded text-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Основная информация о курсе */}
          <div className="bg-surface p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-primary mb-4">Основная информация</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-secondary mb-1">
                  Название курса
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 bg-gray-900 border border-gray-700 text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-secondary mb-1">
                  Описание курса
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full p-2.5 bg-gray-900 border border-gray-700 text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-secondary mb-1">
                  URL превью (миниатюры)
                </label>
                <input
                  type="url"
                  id="thumbnailUrl"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  className="w-full p-2.5 bg-gray-900 border border-gray-700 text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="categories" className="block text-sm font-medium text-secondary mb-1">
                  Категории (через запятую)
                </label>
                <input
                  type="text"
                  id="categories"
                  value={categories}
                  onChange={(e) => setCategories(e.target.value)}
                  className="w-full p-2.5 bg-gray-900 border border-gray-700 text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-secondary mb-1">
                  Теги (через запятую)
                </label>
                <input
                  type="text"
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full p-2.5 bg-gray-900 border border-gray-700 text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Уроки */}
          <div className="bg-surface p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-primary mb-4">Уроки</h2>
            
            {lessons.map((lesson, index) => (
              <div key={index} className="mb-8 p-4 border border-gray-700 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-primary">Урок {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeLesson(index)}
                    className="p-1.5 bg-red-600/20 text-red-400 rounded-full hover:bg-red-600/30 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor={`lesson-${index}-title`} className="block text-sm font-medium text-secondary mb-1">
                      Название урока
                    </label>
                    <input
                      type="text"
                      id={`lesson-${index}-title`}
                      value={lesson.title}
                      onChange={(e) => handleLessonChange(index, 'title', e.target.value)}
                      className="w-full p-2.5 bg-gray-900 border border-gray-700 text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`lesson-${index}-description`} className="block text-sm font-medium text-secondary mb-1">
                      Описание урока
                    </label>
                    <textarea
                      id={`lesson-${index}-description`}
                      value={lesson.description}
                      onChange={(e) => handleLessonChange(index, 'description', e.target.value)}
                      rows={3}
                      className="w-full p-2.5 bg-gray-900 border border-gray-700 text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`lesson-${index}-youtube`} className="block text-sm font-medium text-secondary mb-1">
                      YouTube URL или ID видео
                    </label>
                    <input
                      type="text"
                      id={`lesson-${index}-youtube`}
                      placeholder="https://www.youtube.com/watch?v=abcdefghijk или abcdefghijk"
                      onChange={(e) => handleYouTubeUrlChange(index, e.target.value)}
                      className="w-full p-2.5 bg-gray-900 border border-gray-700 text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                    {lesson.youtubeVideoId && (
                      <p className="mt-1 text-sm text-indigo-400">ID видео: {lesson.youtubeVideoId}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor={`lesson-${index}-duration`} className="block text-sm font-medium text-secondary mb-1">
                      Продолжительность (минут)
                    </label>
                    <input
                      type="number"
                      id={`lesson-${index}-duration`}
                      value={lesson.duration}
                      onChange={(e) => handleLessonChange(index, 'duration', Number(e.target.value))}
                      min="0"
                      step="1"
                      className="w-full p-2.5 bg-gray-900 border border-gray-700 text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  
                  {/* Материалы урока */}
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-md font-medium text-primary">Дополнительные материалы</h4>
                      <button
                        type="button"
                        onClick={() => addMaterial(index)}
                        className="text-sm px-3 py-1 bg-indigo-600/20 text-indigo-400 rounded-md hover:bg-indigo-600/30 focus:outline-none"
                      >
                        Добавить материал
                      </button>
                    </div>
                    
                    {lesson.materials && lesson.materials.length > 0 ? (
                      <div className="space-y-3 mt-2">
                        {lesson.materials.map((material, materialIndex) => (
                          <div key={materialIndex} className="flex items-center space-x-2">
                            <input
                              type="text"
                              placeholder="Название материала"
                              value={material.title}
                              onChange={(e) => handleMaterialChange(index, materialIndex, 'title', e.target.value)}
                              className="flex-1 p-2 bg-gray-900 border border-gray-700 text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <input
                              type="url"
                              placeholder="URL материала"
                              value={material.fileUrl}
                              onChange={(e) => handleMaterialChange(index, materialIndex, 'fileUrl', e.target.value)}
                              className="flex-1 p-2 bg-gray-900 border border-gray-700 text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <select
                              value={material.fileType}
                              onChange={(e) => handleMaterialChange(index, materialIndex, 'fileType', e.target.value)}
                              className="w-24 p-2 bg-gray-900 border border-gray-700 text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option value="pdf">PDF</option>
                              <option value="doc">DOC</option>
                              <option value="ppt">PPT</option>
                              <option value="zip">ZIP</option>
                              <option value="link">Ссылка</option>
                            </select>
                            <button
                              type="button"
                              onClick={() => removeMaterial(index, materialIndex)}
                              className="p-1 bg-red-600/20 text-red-400 rounded-full hover:bg-red-600/30 focus:outline-none"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Нет добавленных материалов</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addLesson}
              className="w-full mt-4 py-2 bg-indigo-600/20 text-indigo-400 rounded-md hover:bg-indigo-600/30 focus:outline-none"
            >
              + Добавить урок
            </button>
          </div>

          {/* Кнопки действий */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 bg-gray-700 text-white rounded-md hover:bg-gray-600 focus:outline-none"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-md hover:opacity-90 focus:outline-none disabled:opacity-50"
            >
              {isLoading ? 'Создание...' : 'Создать курс'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 