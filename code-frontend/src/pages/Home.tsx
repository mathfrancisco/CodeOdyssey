import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import coursesService from '../services/courses.service';
import { Course } from '../types/courses';
import { useAppSelector } from '../store/slices/hooks';

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courses = await coursesService.getAllCourses();
        setFeaturedCourses(courses.slice(0, 3)); // Get top 3 courses
        setLoading(false);
      } catch (error) {
        setError('Failed to load courses. Please try again later.');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="bg-stone-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="md:w-3/5">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Aprenda programação de forma interativa
            </h1>
            <p className="mt-6 text-xl text-white/90 max-w-3xl">
              CodeOdyssey oferece cursos práticos de programação com feedback em tempo real,
              projetos interativos e uma comunidade de apoio.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-lg text-blue-800 bg-stone-100 shadow-lg shadow-blue-900/20 hover:bg-white transition-all duration-300"
                >
                  Ir para Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-lg text-blue-800 bg-stone-100 shadow-lg shadow-blue-900/20 hover:bg-white transition-all duration-300"
                  >
                    Começar Gratuitamente
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-5 py-3 border border-stone-200/20 text-base font-medium rounded-lg text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
                  >
                    Já tenho uma conta
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Abstract decorative element */}
        <div className="hidden md:block absolute right-0 bottom-0 transform translate-y-1/3 opacity-20 mix-blend-overlay">
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

      {/* Featured Courses Section */}
      <div className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent sm:text-4xl">
              Cursos em Destaque
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-slate-600 sm:mt-4">
              Comece sua jornada com nossos cursos mais populares
            </p>
          </div>

          {loading ? (
            <div className="mt-12 flex justify-center">
              <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : error ? (
            <div className="mt-12 text-center text-red-600">{error}</div>
          ) : (
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredCourses.map((course) => (
                <div key={course.id} className="flex flex-col rounded-xl shadow-lg overflow-hidden bg-white hover:shadow-xl transition-all duration-300 group">
                  <div className="flex-shrink-0">
                    <div className="h-48 w-full bg-gradient-to-r from-blue-100 via-stone-100 to-blue-50 group-hover:scale-105 transition-transform duration-500"></div>
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                        </span>
                        <div className="h-1 w-1 rounded-full bg-slate-300"></div>
                        <span className="text-sm text-slate-500">{course.technologies.length} tecnologias</span>
                      </div>
                      <div className="block mt-2">
                        <p className="text-xl font-semibold text-slate-900 group-hover:text-blue-700 transition-colors duration-300">{course.title}</p>
                        <p className="mt-3 text-base text-slate-500">{course.description}</p>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {course.technologies.map((tech) => (
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
                        className="inline-flex items-center text-base font-semibold text-blue-700 hover:text-blue-600 group-hover:translate-x-1 transition-transform duration-300"
                      >
                        Ver Detalhes
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              to="/courses"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 shadow-lg shadow-blue-500/20 transition-all duration-300"
            >
              Ver Todos os Cursos
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent sm:text-4xl">
              Por que escolher CodeOdyssey?
            </h2>
          </div>
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: 'Aprendizado Interativo',
                  description: 'Pratique código diretamente no navegador com feedback em tempo real para fortalecer seu aprendizado.',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  ),
                  color: 'bg-gradient-to-br from-blue-700 to-blue-500',
                },
                {
                  title: 'Projetos Práticos',
                  description: 'Desenvolva projetos do mundo real para construir seu portfólio e demonstrar suas habilidades.',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  ),
                  color: 'bg-gradient-to-br from-blue-600 to-stone-400',
                },
                {
                  title: 'Comunidade de Apoio',
                  description: 'Conecte-se com outros estudantes e instrutores para tirar dúvidas e acelerar seu aprendizado.',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  ),
                  color: 'bg-gradient-to-br from-stone-500 to-stone-300',
                },
              ].map((feature, index) => (
                <div key={index} className="flex flex-col items-center group">
                  <div className={`flex items-center justify-center h-16 w-16 rounded-xl ${feature.color} text-white shadow-lg transform group-hover:scale-110 transition-all duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-3 text-base text-slate-500 text-center max-w-md">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <div className="lg:w-3/5">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Pronto para começar?</span>
              <span className="block text-stone-200 mt-1">Junte-se a milhares de programadores hoje.</span>
            </h2>
            <p className="mt-4 text-lg text-white/80 max-w-2xl">
              Inicie sua jornada de desenvolvimento agora mesmo e transforme seu futuro profissional com habilidades de programação que o mercado valoriza.
            </p>
          </div>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-6 py-4 border border-transparent text-lg font-medium rounded-lg text-blue-800 bg-stone-100 shadow-lg shadow-blue-900/20 hover:bg-white transition-all duration-300"
              >
                Começar Agora
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

export default Home;
