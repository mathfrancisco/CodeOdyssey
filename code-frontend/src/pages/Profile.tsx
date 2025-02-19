import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/slices/hooks';
import userService from '../services/user.service';
import { updateUser } from '../store/slices/authSlice';
import { validateEmail, validatePassword } from '../utils/validators';

interface UserProfile {
  name: string;
  email: string;
  bio: string;
  preferences: {
    emailNotifications: boolean;
    darkMode: boolean;
  }
}

const Profile: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    bio: '',
    preferences: {
      emailNotifications: true,
      darkMode: false,
    }
  });
  
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState('');
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const userData = await userService.getUserProfile();
        setProfile({
          name: userData.name,
          email: userData.email,
          bio: userData.bio || '',
          preferences: {
            emailNotifications: userData.preferences?.emailNotifications ?? true,
            darkMode: userData.preferences?.darkMode ?? false,
          }
        });
      } catch (error) {
        setErrors({ general: 'Erro ao carregar perfil. Tente novamente.' });
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchUserProfile();
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const validateProfileForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!profile.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!profile.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validateEmail(profile.email)) {
      newErrors.email = 'Email inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validatePasswordForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!password.current) {
      newErrors.current = 'Senha atual é obrigatória';
    }
    
    if (!password.new) {
      newErrors.new = 'Nova senha é obrigatória';
    } else if (!validatePassword(password.new)) {
      newErrors.new = 'A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, um número e um caractere especial';
    }
    
    if (password.new !== password.confirm) {
      newErrors.confirm = 'As senhas não conferem';
    }
    
    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: checked
      }
    }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPassword(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setSuccessMessage('');
      
      await userService.updateProfile({
        name: profile.name,
        email: profile.email,
        bio: profile.bio,
        preferences: profile.preferences
      });
      
      dispatch(updateUser({
        name: profile.name,
        email: profile.email
      }));
      
      setSuccessMessage('Perfil atualizado com sucesso!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar perfil. Tente novamente.';
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    try {
      setPasswordLoading(true);
      setPasswordSuccessMessage('');
      
      await userService.updatePassword(
        password.current,
        password.new
      );
      
      setPasswordSuccessMessage('Senha atualizada com sucesso!');
      
      // Reset password fields
      setPassword({
        current: '',
        new: '',
        confirm: ''
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setPasswordSuccessMessage('');
      }, 3000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar senha. Verifique sua senha atual.';
      setPasswordErrors({ submit: errorMessage });
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading && !profile.name) {
    return (
      <div className="flex justify-center items-center h-screen">
        <svg className="animate-spin h-12 w-12 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="mt-2 text-gray-600">Gerencie suas informações pessoais e preferências</p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1">
            <div className="bg-white shadow rounded-lg p-4 sticky top-4">
              <nav className="space-y-2">
                <a href="#profile-info" className="block px-4 py-2 rounded-md text-primary-600 bg-primary-50 font-medium">
                  Informações Pessoais
                </a>
                <a href="#security" className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors">
                  Segurança
                </a>
                <a href="#preferences" className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors">
                  Preferências
                </a>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Profile Information */}
            <section id="profile-info" className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Informações Pessoais</h2>
              </div>
              
              {errors.submit && (
                <div className="mx-6 mt-4 rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{errors.submit}</h3>
                    </div>
                  </div>
                </div>
              )}
              
              {successMessage && (
                <div className="mx-6 mt-4 rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">{successMessage}</h3>
                    </div>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleUpdateProfile} className="p-6 space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nome completo
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={profile.name}
                    onChange={handleProfileChange}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Biografia
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={profile.bio}
                    onChange={handleProfileChange}
                    placeholder="Conte um pouco sobre você e seus interesses em programação..."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  ></textarea>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {loading && (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
            </section>
            
            {/* Security Section */}
            <section id="security" className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Segurança</h2>
              </div>
              
              {passwordErrors.submit && (
                <div className="mx-6 mt-4 rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{passwordErrors.submit}</h3>
                    </div>
                  </div>
                </div>
              )}
              
              {passwordSuccessMessage && (
                <div className="mx-6 mt-4 rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">{passwordSuccessMessage}</h3>
                    </div>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleUpdatePassword} className="p-6 space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Alterar Senha</h3>
                
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                    Senha atual
                  </label>
                  <input
                    id="currentPassword"
                    name="current"
                    type="password"
                    value={password.current}
                    onChange={handlePasswordChange}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      passwordErrors.current ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                    }`}
                  />
                  {passwordErrors.current && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.current}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    Nova senha
                  </label>
                  <input
                    id="newPassword"
                    name="new"
                    type="password"
                    value={password.new}
                    onChange={handlePasswordChange}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      passwordErrors.new ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                    }`}
                  />
                  {passwordErrors.new && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.new}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirmar nova senha
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirm"
                    type="password"
                    value={password.confirm}
                    onChange={handlePasswordChange}
                    className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                      passwordErrors.confirm ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                    }`}
                  />
                  {passwordErrors.confirm && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.confirm}</p>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {passwordLoading && (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {passwordLoading ? 'Atualizando...' : 'Atualizar Senha'}
                  </button>
                </div>
              </form>
            </section>
            
            {/* Preferences Section */}
            <section id="preferences" className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Preferências</h2>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="emailNotifications"
                        name="emailNotifications"
                        type="checkbox"
                        checked={profile.preferences.emailNotifications}
                        onChange={handlePreferenceChange}
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="emailNotifications" className="font-medium text-gray-700">Notificações por email</label>
                      <p className="text-gray-500">Receba emails sobre novos cursos, atualizações e dicas de programação.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="darkMode"
                        name="darkMode"
                        type="checkbox"
                        checked={profile.preferences.darkMode}
                        onChange={handlePreferenceChange}
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="darkMode" className="font-medium text-gray-700">Modo escuro</label>
                      <p className="text-gray-500">Usar interface com tema escuro (salve para aplicar).</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleUpdateProfile}
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {loading && (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {loading ? 'Salvando...' : 'Salvar Preferências'}
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
