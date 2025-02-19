import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeaturedCourses } from '../store/slices/coursesSlice';
import { selectFeaturedCourses } from '../store/slices/coursesSlice';
import { useAppDispatch, useAppSelector } from '../store/slices/hooks';

const Home = () => {
  const dispatch = useAppDispatch();
  const featuredCourses = useAppSelector(selectFeaturedCourses);
  const { isAuthenticated } = useAppSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchFeaturedCourses());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-8 mb-12 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Embarque na sua jornada de programação</h1>
          <p className="text-xl mb-8">
            Aprenda a programar com cursos interativos, exercícios práticos e feedback em tempo real.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-white text-primary-700 font-semibold rounded-lg hover:bg-gray-100 transition"
              >
                Acessar Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-6 py-3 bg-white text-primary-700 font-semibold rounded-lg hover:bg-gray-100 transition"
                >
                  Criar Conta Grátis
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition"
                >
                  Fazer Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Cursos em Destaque</h2>
          <Link to="/courses" className="text-primary-600 hover:text-primary-700">
            Ver todos os cursos
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="h-48 bg-gray-200">
                {course.coverImage ? (
                  <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-500">
                    <span className="text-2xl">{course.title.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                    {course.level}
                  </span>
                  <span className="ml-2 text-gray-500 text-sm">{course.language}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span>{course.rating.toFixed(1)}</span>
                  </div>
                  <Link
                    to={`/courses/${course.id}`}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                  >
                    Ver Curso
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-8 text-center">Por que escolher CodeOdyssey?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Aprendizado Prático</h3>
            <p className="text-gray-600">
              Aprenda programação na prática com nosso editor de código integrado e exercícios interativos.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Feedback Imediato</h3>
            <p className="text-gray-600">
              Receba feedback em tempo real sobre seu código, identificando erros e sugerindo melhorias.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Comunidade Ativa</h3>
            <p className="text-gray-600">
              Conecte-se com outros estudantes e instrutores para colaborar, tirar dúvidas e compartilhar conhecimento.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary-600 rounded-xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Pronto para começar sua jornada?</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Junte-se a milhares de estudantes que estão transformando suas carreiras através da programação.
        </p>
        <Link
          to="/register"
          className="px-6 py-3 bg-white text-secondary-700 font-semibold rounded-lg hover:bg-gray-100 transition inline-block"
        >
          Começar Agora
        </Link>
      </section>
    </div>
  );
};

export default Home;
