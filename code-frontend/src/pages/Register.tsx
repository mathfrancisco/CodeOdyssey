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
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <input
            id={name}
            name={name}
            type={type}
            autoComplete={name}
            required
            className={`mt-1 appearance-none block w-full px-3 py-2 border ${
                errors[name] ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
            placeholder={placeholder}
            value={formData[name].toString()}
            onChange={handleInputChange}
        />
        {errors[name] && (
            <p className="mt-1 text-sm text-red-600">{errors[name]}</p>
        )}
      </div>
  );

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Crie sua conta
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Ou{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                faça login se já tiver uma conta
              </Link>
            </p>
          </div>

          {errors.submit && (
              <div className="rounded-md bg-red-50 p-4">
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
                    <h3 className="text-sm font-medium text-red-800">{errors.submit}</h3>
                  </div>
                </div>
              </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="rounded-md shadow-sm space-y-4">
              {renderField('name', 'Nome completo', 'text', 'Seu nome completo')}
              {renderField('email', 'Email', 'email', 'seu@email.com')}
              {renderField('password', 'Senha', 'password', 'Senha')}
              {renderField('confirmPassword', 'Confirmar senha', 'password', 'Confirme sua senha')}

              <div className="flex items-center">
                <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                />
                <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
                  Eu concordo com os{' '}
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                    Termos de Serviço
                  </a>{' '}
                  e{' '}
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                    Política de Privacidade
                  </a>
                </label>
              </div>
              {errors.agreeToTerms && (
                  <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms}</p>
              )}
            </div>

            <div>
              <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {isSubmitting ? (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-primary-500 group-hover:text-primary-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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