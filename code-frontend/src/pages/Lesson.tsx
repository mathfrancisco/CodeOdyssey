import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import coursesService, { Lesson as LessonType } from '../services/courses.service';
import userService from '../services/user.service';
import { useAppSelector, useAppDispatch } from '../store/slices/hooks';
import { completeLesson } from '../store/slices/progressSlice';
import { formatDuration } from '../utils/formatters';

const Lesson: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
      if (!id) return;
      
      try {
        setLoading(true);
        const lessonData = await coursesService.getLessonById(id);
        setLesson(lessonData);
        
        // Get course info
        const courseData = await coursesService.getCourseById(lessonData.courseId);
        setCourse({
          id: courseData.id,
          title: courseData.title
        });
        
        // Get all lessons from course to determine next/prev
        const courseLessons = await coursesService.getCourseLessons(lessonData.courseId);
        const currentIndex = courseLessons.findIndex(lesson => lesson.id === id);
        
        if (currentIndex > 0) {
          setPrevLesson(courseLessons[currentIndex - 1].id);
        }
        
        if (currentIndex < courseLessons.length - 1) {
          setNextLesson(courseLessons[currentIndex + 1].id);
        }
        
        // Check if lesson is completed
        if (user) {
          const lessonStatus = await userService.checkLessonStatus(id);
          setIsCompleted(lessonStatus.isCompleted);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Falha ao carregar a aula. Por favor, tente novamente.');
        setLoading(false);
      }
    };

    fetchLessonData();
  }, [id, user]);

  const handleMarkComplete = async () => {
    if (!id || !user || isCompleted) return;
    
    try {
      await userService.markLessonComplete(id);
      setIsCompleted(true);
      dispatch(completeLesson({ lessonId: id }));
      
      // If there's a next lesson, ask if user wants to continue
      if (nextLesson) {
        const shouldContinue = window.confirm('Aula marcada como concluída! Deseja continuar para a próxima aula?');
        if (shouldContinue) {
          navigate(`/lessons/${nextLesson}`);
        }
      }
    } catch (err) {
      setError('Falha ao marcar aula como concluída. Por favor, tente novamente.');
    }
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

  if (!lesson) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-xl text-gray-700">Aula não encontrada</p>
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
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            {course && (
              <Link to={`/courses/${course.id}`} className="text-primary-600 hover:text-primary-700 flex items-center">
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
                to={`/lessons/${prevLesson}`}
                className="text-gray-600 hover:text-gray-900 flex items-center text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Anterior
              </Link>
            )}
            
            {nextLesson && (
              <Link 
                to={`/lessons/${nextLesson}`}
                className="text-gray-600 hover:text-gray-900 flex items-center text-sm"
              >
                Próxima
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
            )}
            
            <button 
              onClick={() => setNavbarOpen(!navbarOpen)}
              className="sm:hidden inline-flex items-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
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
        {/* Sidebar for navigation (hidden on mobile) */}
        <div className={`bg-white shadow-sm w-full sm:w-80 lg:w-96 fixed inset-0 z-20 sm:static sm:block transition-all duration-300 transform ${
          navbarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
        }`}>
          <div className="h-full overflow-y-auto p-4">
            <div className="flex items-center justify-between sm:hidden">
              <h2 className="text-lg font-medium text-gray-900">Índice do Curso</h2>
              <button 
                onClick={() => setNavbarOpen(false)}
                className="inline-flex items-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="hidden sm:block">
              <h2 className="text-lg font-medium text-gray-900">Índice do Curso</h2>
            </div>
            
            <div className="mt-6">
              {course && <h3 className="text-sm font-medium text-gray-500">{course.title}</h3>}
              
              {/* Would be populated by course lessons in a real app */}
              <div className="mt-2 space-y-1">
                <div className={`flex items-center p-2 rounded-md ${
                  true ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                }`}>
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 text-xs">
                    1
                  </span>
                  <span className="ml-3 text-sm truncate">{lesson.title}</span>
                  {isCompleted && (
                    <svg className="ml-auto h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                {/* More lesson entries would be here */}
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          {navbarOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-10 sm:hidden" onClick={() => setNavbarOpen(false)}></div>
          )}
          
          <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Lesson Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    {formatDuration(lesson.duration || 0)}
                  </div>
                </div>
              </div>
              
              {/* Lesson Content */}
              <div className="p-6">
                <div className="prose max-w-none">
                  <p>{lesson.description}</p>
                  
                  {/* This would be replaced with the actual lesson content */}
                  <div className="bg-gray-100 p-4 rounded-md my-6">
                    <h3>Conteúdo da Aula</h3>
                    <p>Este é o conteúdo principal da aula, que pode incluir texto, código, imagens e vídeos.</p>
                    
                    <h4 className="mt-4">Exemplo de código:</h4>
                    <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                      <code>
                        {`function exemplo() {
  const mensagem = "Olá, Mundo!";
  console.log(mensagem);
  return mensagem;
}`}
                      </code>
                    </pre>
                    
                    <h4 className="mt-4">Vídeo da aula:</h4>
                    <div className="bg-gray-200 h-64 flex items-center justify-center rounded-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  
                  <h3>Exercícios Práticos</h3>
                  <p>Complete os seguintes exercícios para praticar o que você aprendeu:</p>
                  <ol>
                    <li>Implemente a função descrita no exemplo acima.</li>
                    <li>Modifique a função para aceitar um parâmetro nome e retornar "Olá, [nome]!"</li>
                    <li>Crie um teste unitário para sua função.</li>
                  </ol>
                </div>
              </div>
              
              {/* Lesson Footer */}
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div className="flex items-center text-sm text-gray-500 mb-4 sm:mb-0">
                    {isCompleted ? (
                      <div className="flex items-center text-green-600">
                        <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Aula concluída
                      </div>
                    ) : (
                      <div>Não concluída</div>
                    )}
                  </div>
                  
                  <div className="flex space-x-4">
                    {!isCompleted && user && (
                      <button
                        onClick={handleMarkComplete}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Marcar como Concluída
                      </button>
                    )}
                    
                    {nextLesson && (
                      <Link
                        to={`/lessons/${nextLesson}`}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
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
            
            {/* Comments Section - Would be implemented in a real app */}
            <div className="mt-8 bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Discussão</h2>
              </div>
              
              <div className="p-6">
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <span className="inline-block h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                      <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <textarea
                      rows={3}
                      className="shadow-sm block w-full focus:ring-primary-500 focus:border-primary-500 sm:text-sm border border-gray-300 rounded-md"
                      placeholder="Adicione um comentário..."
                    ></textarea>
                    
                    <div className="mt-3 flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Comentar
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="text-center text-sm text-gray-500">
                    Seja o primeiro a comentar nesta aula.
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
