import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/slices/hooks';
import { authStart, setUser, authFail } from '../store/slices/authSlice';
import authService from '../services/auth.service';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.email.trim() || !formData.password.trim()) {
      dispatch(authFail('Por favor, preencha todos os campos.'));
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      dispatch(authFail('Por favor, insira um email válido.'));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!validateForm()) {
      return;
    }

    try {
      dispatch(authStart());

      const userData = await authService.login({
        email: formData.email,
        password: formData.password
      });

      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      dispatch(setUser(userData));
      navigate('/dashboard');

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Ocorreu um erro ao fazer login.';
      dispatch(authFail(errorMessage));
    }
  };

  useEffect(() => {
    // Limpar mensagens de erro quando o componente é desmontado
    return () => {
      dispatch(authFail(''));
    };
  }, [dispatch]);

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Entre na sua conta
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Ou{' '}
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                registre-se gratuitamente
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`appearance-none rounded-t-md relative block w-full px-3 py-2 border ${
                        submitted && !formData.email ? 'border-red-300' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm`}
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Senha</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className={`appearance-none rounded-b-md relative block w-full px-3 py-2 border ${
                        submitted && !formData.password ? 'border-red-300' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm`}
                    placeholder="Senha"
                    value={formData.password}
                    onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                  Lembrar-me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                  Esqueceu sua senha?
                </Link>
              </div>
            </div>

            <div>
              <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg
                    className="h-5 w-5 text-primary-500 group-hover:text-primary-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                  <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                  />
                </svg>
              </span>
                Entrar
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default Login;