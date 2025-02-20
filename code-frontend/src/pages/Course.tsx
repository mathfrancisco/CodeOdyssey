import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import coursesService from '../services/courses.service';
import { useAppSelector, useAppDispatch } from '../store/slices/hooks';
import { enrollCourse } from '../store/slices/progressSlice';
import { formatDuration } from '../utils/formatters';
import { Course as CourseType, Module} from '../types/courses';

const Course: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<CourseType | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(false);

  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const [courseData, userProgress] = await Promise.all([
          coursesService.getCourseById(id),
          user ? coursesService.getUserProgress(id) : null
        ]);

        setCourse(courseData);
        setModules(courseData.modules || []);

        if (userProgress) {
          setIsEnrolled(true);
          setProgress(userProgress.completionPercentage || 0);
        }

        setLoading(false);
      } catch (err) {
        setError('Falha ao carregar informações do curso. Por favor, tente novamente.');
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id, user]);

  const handleEnrollment = async () => {
    if (!id || !user) return;

    try {
      setEnrolling(true);
      await coursesService.enrollInCourse(id);
      setIsEnrolled(true);
      dispatch(enrollCourse({ courseId: id, userId: user.id }));
      setEnrolling(false);
    } catch (err) {
      setError('Falha ao se matricular no curso. Por favor, tente novamente.');
      setEnrolling(false);
    }
  };

  const getTotalLessons = () => {
    return modules.reduce((total, module) => total + module.lessons.length, 0);
  };

  const getTotalDuration = () => {
    return modules.reduce((total, module) =>
        total + module.lessons.reduce((lessonTotal, lesson) =>
            lessonTotal + (lesson.duration || 0), 0), 0);
  };

  if (loading) {
    return (
        <div className="min-h-screen flex justify-center items-center">
          <svg className="animate-spin h-12 w-12 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen flex justify-center items-center">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-xl text-gray-700">{error}</p>
            <button
                onClick={() => window.location.reload()}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
    );
  }

  if (!course) {
    return (
        <div className="min-h-screen flex justify-center items-center">
          <div className="text-center">
            <p className="text-xl text-gray-700">Curso não encontrado</p>
            <Link
                to="/courses"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Ver todos os cursos
            </Link>
          </div>
        </div>
    );
  }

  return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Course Header */}
            <div className="p-8 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      course.level === 'beginner' ? 'bg-green-100 text-green-800' :
                          course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                  }`}>
                    {course.level === 'beginner' ? 'Iniciante' :
                        course.level === 'intermediate' ? 'Intermediário' : 'Avançado'}
                  </span>
                    <div className="ml-4 flex items-center text-sm text-gray-500">
                      <span className="ml-2">{course.enrolledCount} alunos</span>
                    </div>
                  </div>

                  <h1 className="mt-4 text-3xl font-bold text-gray-900">{course.title}</h1>
                  <p className="mt-2 text-gray-600">{course.description}</p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {course.technologies.map((tech) => (
                        <span
                            key={tech}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                        >
                      {tech}
                    </span>
                    ))}
                  </div>
                </div>

                {/* Enrollment Card */}
                <div className="mt-6 lg:mt-0 lg:ml-8 lg:flex-shrink-0">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm w-full lg:w-64">
                    {isEnrolled ? (
                        <div>
                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-gray-700">Seu progresso</span>
                              <span className="text-sm font-medium text-primary-600">{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                  className="bg-primary-600 h-2 rounded-full"
                                  style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>

                          <Link
                              to={`/lessons/${modules[0]?.lessons[0]?.id || ''}`}
                              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                          >
                            Continuar Curso
                          </Link>
                        </div>
                    ) : (
                        <button
                            onClick={handleEnrollment}
                            disabled={enrolling || !user}
                            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                        >
                          {enrolling ? 'Matriculando...' : !user ? 'Faça login para se matricular' : 'Matricular-se Gratuitamente'}
                        </button>
                    )}

                    <div className="mt-4 space-y-3">
                      <div className="flex">
                        <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="ml-2 text-sm text-gray-600">{getTotalLessons()} aulas</span>
                      </div>
                      <div className="flex">
                        <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="ml-2 text-sm text-gray-600">{formatDuration(getTotalDuration())}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructor Info */}
            {course.instructor && (
                <div className="p-8 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Instrutor</h2>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                  <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                    <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-md font-medium text-gray-900">{course.instructor.name}</h3>
                    </div>
                  </div>
                </div>
            )}

            {/* Course Content */}
            <div className="p-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Conteúdo do Curso</h2>

              {modules.length > 0 ? (
                  <div className="space-y-4">
                    {modules.map((module, moduleIndex) => (
                        <div key={module.id} className="border rounded-md overflow-hidden">
                          <div className="bg-gray-50 px-4 py-3 border-b">
                            <h3 className="text-md font-medium text-gray-900">
                              Módulo {moduleIndex + 1}: {module.title}
                            </h3>
                          </div>
                          <div className="divide-y divide-gray-200">
                            {module.lessons.map((lesson, lessonIndex) => (
                                <div key={lesson.id} className="p-4 hover:bg-gray-50">
                                  <div className="flex items-start">
                                    <div className="flex-shrink-0 pt-1">
                  <span className="flex h-6 w-6 rounded-full bg-primary-100 text-primary-800 text-xs items-center justify-center font-medium">
                    {lessonIndex + 1}
                  </span>
                                    </div>
                                    <div className="ml-3 flex-1">
                                      <div className="flex items-center justify-between">
                                        <h4 className="text-md font-medium text-gray-900">
                                          {lesson.title}
                                        </h4>
                                        <div className="flex items-center space-x-4">
                                          {lesson.videoUrl && (
                                              <svg
                                                  className="h-5 w-5 text-gray-400"
                                                  fill="none"
                                                  viewBox="0 0 24 24"
                                                  stroke="currentColor"
                                              >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                              </svg>
                                          )}
                                          <span className="text-sm text-gray-500">
                        {formatDuration(lesson.duration)}
                      </span>
                                        </div>
                                      </div>
                                      {lesson.exercises.length > 0 && (
                                          <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {lesson.exercises.length} exercício(s)
                      </span>
                                          </div>
                                      )}
                                      {isEnrolled ? (
                                          <Link
                                              to={`/lessons/${lesson.id}`}
                                              className="mt-2 inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
                                          >
                                            Ir para aula
                                            <svg
                                                className="ml-1 h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                              <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M9 5l7 7-7 7"
                                              />
                                            </svg>
                                          </Link>
                                      ) : (
                                          <span className="mt-2 inline-block text-sm text-gray-500">
                      Matricule-se para acessar
                    </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                            ))}
                          </div>
                        </div>
                    ))}
                  </div>
              ) : (
                  <div className="text-center py-12">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      Nenhum conteúdo disponível
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      O conteúdo deste curso está sendo preparado.
                    </p>
                  </div>
              )}

              {/* Course Requirements */}
              {course.requirements && (
                  <div className="mt-8">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                      Pré-requisitos
                    </h2>
                    <ul className="space-y-2">
                      {course.requirements.map((requirement, index) => (
                          <li key={index} className="flex items-start">
                            <svg
                                className="h-5 w-5 text-gray-400 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                              <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="text-gray-600">{requirement}</span>
                          </li>
                      ))}
                    </ul>
                  </div>
              )}

              {/* Course Goals */}
              {course.goals && (
                  <div className="mt-8">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                      O que você vai aprender
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {course.goals.map((goal, index) => (
                          <div key={index} className="flex items-start">
                            <svg
                                className="h-5 w-5 text-green-500 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                              <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="text-gray-600">{goal}</span>
                          </div>
                      ))}
                    </div>
                  </div>
              )}

            </div>
          </div>
        </div>
      </div>
  );
};

export default Course;