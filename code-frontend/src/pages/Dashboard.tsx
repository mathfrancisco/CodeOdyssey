import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../store/slices/hooks';
import userService from '../services/user.service';
import coursesService from '../services/courses.service';
import { Course } from '../types/courses';
import { UserStats } from '../types/user';

const Dashboard = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch user stats
        const stats = await userService.getUserStats();
        setUserStats(stats);

        // Fetch enrolled courses
        const userCourses = await userService.getEnrolledCourses();
        setEnrolledCourses(userCourses);

        // Fetch recommended courses
        const allCourses = await coursesService.getAllCourses();
        // Filter out courses the user is already enrolled in
        const enrolledIds = userCourses.map((course: { id: any; }) => course.id);
        const recommended = allCourses
            .filter((course: { id: any; }) => !enrolledIds.includes(course.id))
            .slice(0, 3);
        setRecommendedCourses(recommended);

        setLoading(false);
      } catch (error) {
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all duration-300"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
    );
  }

  return (
      <div className="bg-stone-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
            <div className="md:w-3/5">
              <h1 className="text-4xl font-extrabold text-white tracking-tight">
                Olá, {user?.name}!
              </h1>
              <p className="mt-4 text-xl text-white/90 max-w-3xl">
                Bem-vindo de volta ao CodeOdyssey. Continue sua jornada de aprendizado.
              </p>
            </div>
          </div>

          {/* Abstract decorative element */}
          <div className="hidden md:block absolute right-0 transform translate-y-1/3 opacity-20 mix-blend-overlay">
            <svg
                width="404"
                height="404"
                fill="none"
                viewBox="0 0 404 404"
                aria-hidden="true"
            >
              <defs>
                <pattern
                    id="grid-pattern"
                    x="0"
                    y="0"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                >
                  <rect x="0" y="0" width="4" height="4" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="404" height="404" fill="url(#grid-pattern)" />
            </svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
          {/* Stats Overview */}
          {userStats && (
              <div className="mb-12">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-white overflow-hidden rounded-xl shadow-lg shadow-blue-500/5 transform hover:scale-105 transition-all duration-300">
                    <div className="px-4 py-6">
                      <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-blue-100 text-blue-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <dt className="text-sm font-medium text-slate-500 truncate">Cursos Matriculados</dt>
                          <dd className="mt-1 text-3xl font-extrabold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">{userStats.coursesEnrolled}</dd>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white overflow-hidden rounded-xl shadow-lg shadow-blue-500/5 transform hover:scale-105 transition-all duration-300">
                    <div className="px-4 py-6">
                      <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-green-100 text-green-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <dt className="text-sm font-medium text-slate-500 truncate">Cursos Concluídos</dt>
                          <dd className="mt-1 text-3xl font-extrabold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">{userStats.coursesCompleted}</dd>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white overflow-hidden rounded-xl shadow-lg shadow-blue-500/5 transform hover:scale-105 transition-all duration-300">
                    <div className="px-4 py-6">
                      <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-purple-100 text-purple-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <dt className="text-sm font-medium text-slate-500 truncate">Exercícios Concluídos</dt>
                          <dd className="mt-1 text-3xl font-extrabold bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">{userStats.exercisesCompleted}</dd>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white overflow-hidden rounded-xl shadow-lg shadow-blue-500/5 transform hover:scale-105 transition-all duration-300">
                    <div className="px-4 py-6">
                      <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-amber-100 text-amber-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <dt className="text-sm font-medium text-slate-500 truncate">Pontuação Total</dt>
                          <dd className="mt-1 text-3xl font-extrabold bg-gradient-to-r from-amber-600 to-amber-400 bg-clip-text text-transparent">{userStats.totalPoints}</dd>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          )}

          {/* Enrolled Courses */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                Meus Cursos
              </h2>
              <Link
                  to="/courses"
                  className="inline-flex items-center text-base font-semibold text-blue-700 hover:text-blue-600 transition-all duration-300"
              >
                Ver Todos
                <svg
                    className="ml-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                  <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>

            {enrolledCourses.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden p-10 text-center">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 mx-auto text-slate-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <p className="mt-6 text-xl text-slate-600">Você ainda não está matriculado em nenhum curso.</p>
                  <Link
                      to="/courses"
                      className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 shadow-lg shadow-blue-500/20 transition-all duration-300"
                  >
                    Explorar Cursos
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
            ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {enrolledCourses.map((course) => (
                      <div key={course.id} className="flex flex-col rounded-xl shadow-lg overflow-hidden bg-white hover:shadow-xl transition-all duration-300 group">
                        <div className="flex-shrink-0">
                          <div className="h-16 w-full bg-gradient-to-r from-blue-100 via-stone-100 to-blue-50"></div>
                        </div>
                        <div className="flex-1 p-6 flex flex-col justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {course.level?.charAt(0).toUpperCase() + course.level?.slice(1) || 'Iniciante'}
                        </span>
                              <div className="h-1 w-1 rounded-full bg-slate-300"></div>
                              <span className="text-sm text-slate-500">{course.technologies?.length || 0} tecnologias</span>
                            </div>
                            <div className="block mt-2">
                              <p className="text-xl font-semibold text-slate-900 group-hover:text-blue-700 transition-colors duration-300">{course.title}</p>
                            </div>
                            <div className="mt-4">
                              <p className="text-sm font-medium text-slate-500">Progresso do curso</p>
                              <div className="relative pt-1 mt-2">
                                <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
                                  <div
                                      style={{ width: `${course.progress || 0}%` }}
                                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-600 to-blue-800"
                                  ></div>
                                </div>
                                <div className="flex justify-between mt-1">
                                  <span className="text-xs text-blue-700 font-semibold">{course.progress || 0}% Completo</span>
                                  <span className="text-xs text-slate-500">
                              {course.completedLessons || 0}/{course.totalLessons || 10} Aulas
                            </span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                              {course.technologies?.slice(0, 3).map((tech) => (
                                  <span
                                      key={tech}
                                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-200 text-stone-800"
                                  >
                            {tech}
                          </span>
                              ))}
                            </div>
                          </div>
                          <div className="mt-6">
                            <Link
                                to={`/courses/${course.id}`}
                                className="inline-flex items-center justify-center w-full px-5 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all duration-300"
                            >
                              Continuar Curso
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
            )}
          </div>

          {/* Recommended Courses */}
          {recommendedCourses.length > 0 && (
              <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                    Cursos Recomendados
                  </h2>
                  <Link
                      to="/courses"
                      className="inline-flex items-center text-base font-semibold text-blue-700 hover:text-blue-600 transition-all duration-300"
                  >
                    Ver Todos
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {recommendedCourses.map((course) => (
                      <div key={course.id} className="flex flex-col rounded-xl shadow-lg overflow-hidden bg-white hover:shadow-xl transition-all duration-300 group">
                        <div className="flex-shrink-0">
                          <div className="h-48 w-full bg-gradient-to-r from-blue-100 via-stone-100 to-blue-50 group-hover:scale-105 transition-transform duration-500"></div>
                        </div>
                        <div className="flex-1 p-6 flex flex-col justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {course.level?.charAt(0).toUpperCase() + course.level?.slice(1) || 'Iniciante'}
                        </span>
                              <div className="h-1 w-1 rounded-full bg-slate-300"></div>
                              <span className="text-sm text-slate-500">{course.technologies?.length || 0} tecnologias</span>
                            </div>
                            <div className="block mt-2">
                              <p className="text-xl font-semibold text-slate-900 group-hover:text-blue-700 transition-colors duration-300">{course.title}</p>
                              <p className="mt-3 text-base text-slate-500 line-clamp-2">{course.description}</p>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                              {course.technologies?.slice(0, 3).map((tech) => (
                                  <span
                                      key={tech}
                                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-200 text-stone-800"
                                  >
                            {tech}
                          </span>
                              ))}
                            </div>

                            <div className="mt-4 flex items-center">
                              <div className="flex-shrink-0">
                          <span className="inline-block h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                            <svg className="h-full w-full text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          </span>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-slate-900">
                                  {course.instructor?.name || 'Instrutor'}
                                </p>
                                <div className="flex items-center text-sm text-slate-500">
                                  <svg className="flex-shrink-0 mr-1 h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                  <span>{course.rating?.toFixed(1) || '4.5'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-6">
                            <Link
                                to={`/courses/${course.id}`}
                                className="inline-flex items-center justify-center w-full px-5 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all duration-300"
                            >
                              Ver Detalhes
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-3/5">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                <span className="block">Quer aprender mais?</span>
                <span className="block text-stone-200 mt-1">Explore nossa biblioteca de cursos.</span>
              </h2>
              <p className="mt-4 text-lg text-white/80 max-w-2xl">
                Amplie seus conhecimentos com nossos cursos de programação e tecnologia. Desenvolva habilidades para o mercado de trabalho atual.
              </p>
            </div>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link
                    to="/courses"
                    className="inline-flex items-center justify-center px-6 py-4 border border-transparent text-lg font-medium rounded-lg text-blue-800 bg-stone-100 shadow-lg shadow-blue-900/20 hover:bg-white transition-all duration-300"
                >
                  Ver Catálogo
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Dashboard;