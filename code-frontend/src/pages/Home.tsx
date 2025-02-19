// src/pages/Home.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import coursesService, { Course } from '../services/courses.service';
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
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="md:w-3/5">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Aprenda programação de forma interativa
            </h1>
            <p className="mt-6 text-xl text-white max-w-3xl">
              CodeOdyssey oferece cursos práticos de programação com feedback em tempo real,
              projetos interativos e uma comunidade de apoio.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-gray-50"
                >
                  Ir para Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-gray-50"
                  >
                    Começar Gratuitamente
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-5 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-primary-500"
                  >
                    Já tenho uma conta
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Abstract decorative element */}
        <div className="hidden md:block absolute right-0 bottom-0 transform translate-y-1/3">
          <svg
            width="404"
            height="404"
            fill="none"
            viewBox="0 0 404 404"
            aria-hidden="true"
            className="text-white opacity-20"
          >
            <defs>
              <pattern
                id="85737c0e-0916-41d7-917f-596dc7edfa27"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <rect x="0" y="0" width="4" height="4" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="404" fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
          </svg>
        </div>
      </div>

      {/* Featured Courses Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Cursos em Destaque
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Comece sua jornada com nossos cursos mais populares
            </p>
          </div>

          {loading ? (
            <div className="mt-12 flex justify-center">
              <svg className="animate-spin h-12 w-12 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : error ? (
            <div className="mt-12 text-center text-red-600">{error}</div>
          ) : (
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredCourses.map((course) => (
                <div key={course.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                  <div className="flex-shrink-0">
                    <div className="h-48 w-full bg-gradient-to-r from-primary-200 to-primary-300"></div>
                  </div>
                  <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-primary-600">
                        {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                      </p>
                      <div className="block mt-2">
                        <p className="text-xl font-semibold text-gray-900">{course.title}</p>
                        <p className="mt-3 text-base text-gray-500">{course.description}</p>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
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
                    <div className="mt-6">
                      <Link
                        to={`/courses/${course.id}`}
                        className="text-base font-semibold text-primary-600 hover:text-primary-500"
                      >
                        Ver Detalhes →
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
              className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Ver Todos os Cursos
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Por que escolher CodeOdyssey?
            </h2>
          </div>
          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: 'Aprendizado Interativo',
                  description: 'Pratique código diretamente no navegador com feedback em tempo real.',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  ),
                },
                {
                  title: 'Projetos Práticos',
                  description: 'Desenvolva projetos do mundo real para construir seu portfólio.',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  ),
                },
                {
                  title: 'Comunidade de Apoio',
                  description: 'Conecte-se com outros estudantes e instrutores para tirar dúvidas.',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  ),
                },
              ].map((feature, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    {feature.icon}
                  </div>
                  <h3 className="mt-6 text-lg font-medium text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-base text-gray-500 text-center">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Pronto para começar?</span>
            <span className="block text-primary-200">Junte-se a milhares de programadores hoje.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50"
              >
                Começar Agora
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
