import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import coursesService from '../services/courses.service';
import userService from '../services/user.service';
import { useAppSelector, useAppDispatch } from '../store/slices/hooks';
import { updateProgressSuccess } from '../store/slices/progressSlice';
import { formatDuration } from '../utils/formatters';
import { Lesson as LessonType } from "../types/courses.ts";

const Lesson: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const [lesson, setLesson] = useState<LessonType | null>(null);
  const [course, setCourse] = useState<{ id: string; title: string } | null>(null);
  const [nextLesson, setNextLesson] = useState<string | null>(null);
  const [prevLesson, setPrevLesson] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [navbarOpen, setNavbarOpen] = useState(false);

  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessonData = async () => {
      if (!courseId || !lessonId) return;

      try {
        setLoading(true);
        const lessonData = await coursesService.getLessonById(courseId, lessonId);
        setLesson(lessonData);

        const courseData = await coursesService.getCourseById(courseId);
        setCourse({
          id: courseData.id,
          title: courseData.title
        });

        const courseLessons = await coursesService.getCourseLessons(courseId);
        const currentIndex = courseLessons.findIndex((lesson: { id: string; }) => lesson.id === lessonId);

        if (currentIndex > 0) {
          setPrevLesson(courseLessons[currentIndex - 1].id);
        }

        if (currentIndex < courseLessons.length - 1) {
          setNextLesson(courseLessons[currentIndex + 1].id);
        }

        if (user) {
          const lessonStatus = await userService.checkLessonStatus(lessonId);
          setIsCompleted(lessonStatus.isCompleted);
        }

        setLoading(false);
      } catch (err) {
        setError('Falha ao carregar a aula. Por favor, tente novamente.');
        setLoading(false);
      }
    };

    fetchLessonData();
  }, [courseId, lessonId, user]);

  const handleMarkComplete = async () => {
    if (!lessonId || !user || isCompleted) return;

    try {
      await userService.markLessonComplete(lessonId);
      setIsCompleted(true);

      if (courseId) {
        dispatch(updateProgressSuccess({
          certificateIssued: false, exercisesCompleted: [], modulesProgress: [],
          userId: user.id,
          courseId: courseId,
          lessonId: lessonId,
          completedAt: new Date().toISOString()
        }));
      }

      if (nextLesson) {
        const shouldContinue = window.confirm('Aula marcada como concluída! Deseja continuar para a próxima aula?');
        if (shouldContinue) {
          navigate(`/courses/${courseId}/lessons/${nextLesson}`);
        }
      }
    } catch (err) {
      setError('Falha ao marcar aula como concluída. Por favor, tente novamente.');
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen flex justify-center items-center bg-stone-50">
          <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen flex justify-center items-center bg-stone-50">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-xl text-slate-700">{error}</p>
            <button
                onClick={() => window.location.reload()}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
    );
  }

  if (!lesson) {
    return (
        <div className="min-h-screen flex justify-center items-center bg-stone-50">
          <div className="text-center">
            <p className="text-xl text-slate-700">Aula não encontrada</p>
            <Link
                to="/courses"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300"
            >
              Ver todos os cursos
            </Link>
          </div>
        </div>
    );
  }

  return (
      <div className="bg-stone-50 min-h-screen flex flex-col">
        {/* Top Navigation with Blue Gradient */}
        <header className="bg-gradient-to-r from-blue-800 to-blue-600 shadow-lg shadow-blue-800/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center">
              {course && (
                  <Link to={`/courses/${course.id}`} className="text-white/90 hover:text-white flex items-center transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Voltar para o curso
                  </Link>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {prevLesson && (
                  <Link
                      to={`/courses/${courseId}/lessons/${prevLesson}`}
                      className="text-white/80 hover:text-white flex items-center text-sm transition-all duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Anterior
                  </Link>
              )}

              {nextLesson && (
                  <Link
                      to={`/courses/${courseId}/lessons/${nextLesson}`}
                      className="text-white/80 hover:text-white flex items-center text-sm transition-all duration-300"
                  >
                    Próxima
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </Link>
              )}

              <button
                  onClick={() => setNavbarOpen(!navbarOpen)}
                  className="sm:hidden inline-flex items-center p-2 rounded-md text-white/80 hover:text-white hover:bg-blue-700/50 transition-all duration-300"
                  aria-expanded="false"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col sm:flex-row">
          {/* Sidebar for navigation (redesigned) */}
          <div className={`bg-white shadow-xl w-full sm:w-80 lg:w-96 fixed inset-0 z-20 sm:static sm:block transition-all duration-300 transform ${
              navbarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
          }`}>
            <div className="h-full overflow-y-auto p-4">
              <div className="flex items-center justify-between sm:hidden">
                <h2 className="text-lg font-semibold text-slate-900">Índice do Curso</h2>
                <button
                    onClick={() => setNavbarOpen(false)}
                    className="inline-flex items-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 transition-all duration-300"
                >
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="hidden sm:block">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">Índice do Curso</h2>
              </div>

              <div className="mt-6">
                {course && (
                    <h3 className="text-sm font-medium text-slate-500 border-b border-slate-200 pb-2 mb-4">
                      {course.title}
                    </h3>
                )}

                {/* Would be populated by course lessons in a real app */}
                <div className="mt-2 space-y-3">
                  <div className={`flex items-center p-3 rounded-lg ${
                      'bg-blue-50 border-l-4 border-blue-600'
                  } hover:bg-blue-50/80 transition-all duration-300`}>
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                    1
                  </span>
                    <span className="ml-3 text-slate-700 font-medium">{lesson.title}</span>
                    {isCompleted && (
                        <svg className="ml-auto h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    )}
                  </div>
                  {/* Sample additional lessons */}
                  <div className="flex items-center p-3 rounded-lg hover:bg-stone-100 transition-all duration-300">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 text-slate-600 text-sm font-medium">
                    2
                  </span>
                    <span className="ml-3 text-slate-700">Próxima aula</span>
                  </div>
                  <div className="flex items-center p-3 rounded-lg hover:bg-stone-100 transition-all duration-300">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 text-slate-600 text-sm font-medium">
                    3
                  </span>
                    <span className="ml-3 text-slate-700">Aula subsequente</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main content (redesigned) */}
          <div className="flex-1 overflow-y-auto">
            {navbarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-10 sm:hidden" onClick={() => setNavbarOpen(false)}></div>
            )}

            <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-xl shadow-lg shadow-blue-500/5 overflow-hidden hover:shadow-xl transition-all duration-500">
                {/* Lesson Header */}
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">{lesson.title}</h1>
                    <div className="flex items-center text-sm text-slate-500 bg-stone-100 px-3 py-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {formatDuration(lesson.duration || 0)}
                    </div>
                  </div>
                </div>

                {/* Lesson Content */}
                <div className="p-6">
                  <div className="prose max-w-none">
                    <p className="text-lg text-slate-600">{lesson.description}</p>

                    {/* This would be replaced with the actual lesson content */}
                    <div className="bg-stone-50 p-6 rounded-xl my-6 border border-stone-200/80 hover:border-blue-200 transition-all duration-300">
                      <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">Conteúdo da Aula</h3>
                      <p className="mt-3 text-slate-600">Este é o conteúdo principal da aula, que pode incluir texto, código, imagens e vídeos.</p>

                      <h4 className="mt-6 text-lg font-medium text-slate-800">Exemplo de código:</h4>
                      <pre className="bg-slate-800 text-white p-4 rounded-lg overflow-x-auto mt-2 shadow-md">
                      <code>
                        {`function exemplo() {
  const mensagem = "Olá, Mundo!";
  console.log(mensagem);
  return mensagem;
}`}
                      </code>
                    </pre>

                      <h4 className="mt-6 text-lg font-medium text-slate-800">Vídeo da aula:</h4>
                      <div className="bg-slate-200 h-64 flex items-center justify-center rounded-lg mt-2 shadow-inner hover:bg-slate-100 transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-600 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">Exercícios Práticos</h3>
                    <p className="text-slate-600">Complete os seguintes exercícios para praticar o que você aprendeu:</p>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-medium mt-0.5">
                        1
                      </span>
                        <span className="ml-3 text-slate-700">Implemente a função descrita no exemplo acima.</span>
                      </div>
                      <div className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-medium mt-0.5">
                        2
                      </span>
                        <span className="ml-3 text-slate-700">Modifique a função para aceitar um parâmetro nome e retornar "Olá, [nome]!"</span>
                      </div>
                      <div className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-medium mt-0.5">
                        3
                      </span>
                        <span className="ml-3 text-slate-700">Crie um teste unitário para sua função.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lesson Footer */}
                <div className="p-6 bg-gradient-to-r from-stone-50 to-blue-50 border-t border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div className="flex items-center text-sm mb-4 sm:mb-0">
                      {isCompleted ? (
                          <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
                            <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Aula concluída
                          </div>
                      ) : (
                          <div className="text-slate-500 bg-stone-100 px-3 py-1 rounded-full">Não concluída</div>
                      )}
                    </div>

                    <div className="flex space-x-4">
                      {!isCompleted && user && (
                          <button
                              onClick={handleMarkComplete}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 shadow-lg shadow-blue-500/20 transition-all duration-300"
                          >
                            Marcar como Concluída
                          </button>
                      )}

                      {nextLesson && (
                          <Link
                              to={`/courses/${courseId}/lessons/${nextLesson}`}
                              className="inline-flex items-center px-4 py-2 border border-stone-200 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-stone-50 transition-all duration-300"
                          >
                            Próxima Aula
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments Section - Redesigned */}
              <div className="mt-8 bg-white rounded-xl shadow-lg shadow-blue-500/5 overflow-hidden hover:shadow-xl transition-all duration-500">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">Discussão</h2>
                </div>

                <div className="p-6">
                  <div className="flex space-x-3">
                    <div className="flex-shrink-0">
                    <span className="inline-block h-10 w-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-stone-100">
                      <svg className="h-full w-full text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </span>
                    </div>
                    <div className="min-w-0 flex-1">
                    <textarea
                        rows={3}
                        className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-slate-300 rounded-lg resize-none"
                        placeholder="Adicione um comentário..."
                    ></textarea>

                      <div className="mt-3 flex justify-end">
                        <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 shadow-lg shadow-blue-500/20 transition-all duration-300"
                        >
                          Comentar
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-center p-6">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-stone-100 text-slate-400 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <p className="text-slate-500 font-medium">Seja o primeiro a comentar nesta aula.</p>
                      <p className="mt-1 text-slate-400 text-sm">Suas dúvidas e contribuições são valiosas para a comunidade.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Lesson;