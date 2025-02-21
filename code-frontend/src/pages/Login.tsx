import React, { useState } from 'react';
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Por favor, insira um email válido';
      }
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
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
      setErrors({ submit: errorMessage });
      dispatch(authFail(errorMessage));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (
      name: keyof typeof formData,
      label: string,
      type: string = 'text',
      placeholder: string = ''
  ) => (
      <div>
        <label htmlFor={name} className="block text-sm font-semibold text-white/90 mb-1.5">
          {label}
        </label>
        <input
            id={name}
            name={name}
            type={type}
            autoComplete={name}
            required
            className={`w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border ${
                errors[name] ? 'border-red-400' : 'border-white/20'
            } text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300`}
            placeholder={placeholder}
            value={formData[name].toString()}
            onChange={handleInputChange}
        />
        {errors[name] && (
            <p className="mt-2 text-sm text-red-400">{errors[name]}</p>
        )}
      </div>
  );

  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-12 px-4 sm:px-6 lg:px-8">
        {/* Abstract decorative element */}
        <div className="hidden md:block absolute right-0 top-0 transform -translate-y-1/4 opacity-20">
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
                <rect x="0" y="0" width="4" height="4" fill="currentColor" className="text-white" />
              </pattern>
            </defs>
            <rect width="404" height="404" fill="url(#grid-pattern)" />
          </svg>
        </div>

        <div className="max-w-md w-full space-y-8 relative">
          <div>
            <h2 className="text-4xl font-extrabold text-center text-white">
              Entre na sua conta
            </h2>
            <p className="mt-3 text-center text-lg text-white/80">
              Ou{' '}
              <Link to="/register" className="font-medium text-white hover:text-white/90 underline decoration-2 underline-offset-2 transition-all duration-300">
                registre-se gratuitamente
              </Link>
            </p>
          </div>

          {errors.submit && (
              <div className="rounded-lg bg-red-400/10 backdrop-blur-sm border border-red-400/20 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                        className="h-5 w-5 text-red-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                      <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-400">{errors.submit}</h3>
                  </div>
                </div>
              </div>
          )}

          <form className="mt-8 space-y-6 bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20" onSubmit={handleSubmit} noValidate>
            <div className="space-y-5">
              {renderField('email', 'Email', 'email', 'seu@email.com')}
              {renderField('password', 'Senha', 'password', 'Sua senha')}

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      className="h-5 w-5 rounded border-white/20 bg-white/10 text-indigo-500 focus:ring-2 focus:ring-white/20 focus:ring-offset-0"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                  />
                  <label htmlFor="rememberMe" className="ml-3 block text-sm text-white/80">
                    Lembrar-me
                  </label>
                </div>

                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-white hover:text-white/90 underline decoration-2 underline-offset-2">
                    Esqueceu sua senha?
                  </Link>
                </div>
              </div>
            </div>

            <div>
              <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-md font-medium rounded-lg text-indigo-700 bg-white shadow-lg shadow-indigo-500/20 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/60 disabled:opacity-50 transition-all duration-300"
              >
                {isSubmitting ? (
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-indigo-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-indigo-600 group-hover:text-indigo-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </span>
                )}
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default Login;