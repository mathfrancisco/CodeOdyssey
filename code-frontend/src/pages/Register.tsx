import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/slices/hooks';
import { authStart, setUser, authFail } from '../store/slices/authSlice';
import authService from '../services/auth.service';
import { validateEmail, validatePassword } from '../utils/validators';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
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

    // Limpar erro do campo quando o usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validação do nome
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
    }

    // Validação do email
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validação da senha
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, um número e um caractere especial';
    }

    // Validação da confirmação de senha
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não conferem';
    }

    // Validação dos termos
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Você precisa concordar com os termos de serviço';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      dispatch(authStart());

      const userData = await authService.register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password
      });

      dispatch(setUser(userData));
      navigate('/dashboard');

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Ocorreu um erro ao criar sua conta.';

      if (error.response?.status === 409) {
        setErrors({ email: 'Este email já está em uso' });
      } else {
        dispatch(authFail(errorMessage));
        setErrors({ submit: errorMessage });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Limpar mensagens de erro quando o componente é desmontado
    return () => {
      dispatch(authFail(''));
    };
  }, [dispatch]);

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
              Crie sua conta
            </h2>
            <p className="mt-3 text-center text-lg text-white/80">
              Ou{' '}
              <Link to="/login" className="font-medium text-white hover:text-white/90 underline decoration-2 underline-offset-2 transition-all duration-300">
                faça login se já tiver uma conta
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
              {renderField('name', 'Nome completo', 'text', 'Seu nome completo')}
              {renderField('email', 'Email', 'email', 'seu@email.com')}
              {renderField('password', 'Senha', 'password', 'Senha')}
              {renderField('confirmPassword', 'Confirmar senha', 'password', 'Confirme sua senha')}

              <div className="flex items-center">
                <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    className="h-5 w-5 rounded border-white/20 bg-white/10 text-indigo-500 focus:ring-2 focus:ring-white/20 focus:ring-offset-0"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                />
                <label htmlFor="agreeToTerms" className="ml-3 block text-sm text-white/80">
                  Eu concordo com os{' '}
                  <a href="#" className="font-medium text-white hover:text-white/90 underline decoration-2 underline-offset-2">
                    Termos de Serviço
                  </a>{' '}
                  e{' '}
                  <a href="#" className="font-medium text-white hover:text-white/90 underline decoration-2 underline-offset-2">
                    Política de Privacidade
                  </a>
                </label>
              </div>
              {errors.agreeToTerms && (
                  <p className="mt-2 text-sm text-red-400">{errors.agreeToTerms}</p>
              )}
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
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
                )}
                {isSubmitting ? 'Registrando...' : 'Criar conta'}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default Register;