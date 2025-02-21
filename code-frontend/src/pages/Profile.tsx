import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/slices/hooks';
import { updateUser } from '../store/slices/authSlice';
import userService from '../services/user.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook, faTrophy, faFire, faCamera,
  faSpinner, faCheck, faTimes, faLock, faMoon, faLanguage, faClock
} from '@fortawesome/free-solid-svg-icons';
import {
  faGithub,
  faLinkedin,
  faTwitter
} from '@fortawesome/free-brands-svg-icons';
import { faGlobe, faEnvelope, faTablet } from '@fortawesome/free-solid-svg-icons';
import {
  UserProfile,
  UserUpdateRequest,
  UserStats,
  SocialLink,
  ServiceError,
  UserPreferences,
} from '../types/user';

// Fix 1: Change formatDate from a class to a function
const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const ProfilePage: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Fix 2: Ensure preferences is initialized properly
  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    name: '',
    email: '',
    role: 'student',
    profile: {
      avatar: '',
      bio: '',
      socialLinks: []
    },
    preferences: {
      emailNotifications: true,
      darkMode: false,
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo'
    },
    createdAt: '',
    lastLogin: ''
  });

  const [stats, setStats] = useState<UserStats>({
    coursesEnrolled: 0,
    coursesCompleted: 0,
    exercisesCompleted: 0,
    totalPoints: 0,
    streak: 0,
    averageScore: 0
  });

  const [loading, setLoading] = useState({
    profile: false,
    password: false,
    stats: false,
    avatar: false
  });

  const [errors, setErrors] = useState<{
    profile?: string;
    password?: string;
    general?: string;
    preferences?: string;
  }>({});

  const [success, setSuccess] = useState<{
    profile?: string;
    password?: string;
    preferences?: string;
  }>({});

  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [newSocialLink, setNewSocialLink] = useState<SocialLink>({
    type: '',
    url: ''
  });

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences'>('profile');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchUserData();
  }, [isAuthenticated, navigate]);

  const fetchUserData = async () => {
    try {
      setLoading(prev => ({ ...prev, profile: true, stats: true }));

      // Using the appropriate service methods
      const profileData = await userService.getUserProfile();
      const statsData = await userService.getUserStats();

      // Fix 3: Ensure preferences exists in the returned data
      setProfile({
        ...profileData,
        preferences: profileData.preferences || {
          emailNotifications: true,
          darkMode: false,
          language: 'pt-BR',
          timezone: 'America/Sao_Paulo'
        }
      });
      setStats(statsData);
    } catch (error) {
      const serviceError = error as ServiceError;
      setErrors(prev => ({
        ...prev,
        general: serviceError.message || 'Erro ao carregar dados do perfil'
      }));
    } finally {
      setLoading(prev => ({ ...prev, profile: false, stats: false }));
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(prev => ({ ...prev, profile: true }));
      setErrors({});

      // Create proper update request
      const updateData = new UserUpdateRequest({
        name: profile.name,
        profile: {
          bio: profile.profile.bio,
          avatar: profile.profile.avatar,
          socialLinks: profile.profile.socialLinks
        }
      });

      await userService.updateUserProfile(updateData);

      // Update user in Redux store
      dispatch(updateUser({
        name: profile.name,
        avatar: profile.profile.avatar
      }));

      setSuccess(prev => ({
        ...prev,
        profile: 'Perfil atualizado com sucesso!'
      }));

      setTimeout(() => {
        setSuccess(prev => ({ ...prev, profile: undefined }));
      }, 3000);
    } catch (error) {
      const serviceError = error as ServiceError;
      setErrors(prev => ({
        ...prev,
        profile: serviceError.message || 'Erro ao atualizar perfil'
      }));
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      setErrors(prev => ({
        ...prev,
        password: 'As senhas não conferem'
      }));
      return;
    }

    try {
      setLoading(prev => ({ ...prev, password: true }));

      // Fixed to match your service method signature
      await userService.updatePassword(password.current);

      setSuccess(prev => ({
        ...prev,
        password: 'Senha atualizada com sucesso!'
      }));

      setPassword({ current: '', new: '', confirm: '' });

      setTimeout(() => {
        setSuccess(prev => ({ ...prev, password: undefined }));
      }, 3000);
    } catch (error) {
      const serviceError = error as ServiceError;
      setErrors(prev => ({
        ...prev,
        password: serviceError.message || 'Erro ao atualizar senha'
      }));
    } finally {
      setLoading(prev => ({ ...prev, password: false }));
    }
  };

  const handlePreferencesUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(prev => ({ ...prev, profile: true }));
      setErrors({});

      // Create proper update request for preferences only
      const updateData = new UserUpdateRequest({
        preferences: profile.preferences
      });

      await userService.updateUserProfile(updateData);

      setSuccess(prev => ({
        ...prev,
        preferences: 'Preferências atualizadas com sucesso!'
      }));

      setTimeout(() => {
        setSuccess(prev => ({ ...prev, preferences: undefined }));
      }, 3000);
    } catch (error) {
      const serviceError = error as ServiceError;
      setErrors(prev => ({
        ...prev,
        preferences: serviceError.message || 'Erro ao atualizar preferências'
      }));
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  const handleAvatarUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(prev => ({ ...prev, avatar: true }));

      // In a real implementation, you would upload the file to your server
      // This is a simplified example
      const avatarUrl = URL.createObjectURL(file);

      // Update local state
      setProfile(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          avatar: avatarUrl
        }
      }));

      // Create proper update request for avatar
      const updateData = new UserUpdateRequest({
        profile: {
          avatar: avatarUrl
        }
      });

      // Update on server
      await userService.updateUserProfile(updateData);

      // Update in Redux store
      dispatch(updateUser({
        avatar: avatarUrl
      }));
    } catch (error) {
      const serviceError = error as ServiceError;
      setErrors(prev => ({
        ...prev,
        profile: serviceError.message || 'Erro ao atualizar avatar'
      }));
    } finally {
      setLoading(prev => ({ ...prev, avatar: false }));
    }
  };

  const handleSocialLinkAdd = () => {
    if (newSocialLink.type && newSocialLink.url) {
      setProfile(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          socialLinks: [
            ...(prev.profile.socialLinks || []),
            { ...newSocialLink }
          ]
        }
      }));
      setNewSocialLink({ type: '', url: '' });
    }
  };

  const handleSocialLinkRemove = (index: number) => {
    setProfile(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        socialLinks: prev.profile.socialLinks?.filter((_, i) => i !== index)
      }
    }));
  };

  const getSocialIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('github')) return faGithub;
    if (lowerType.includes('linkedin')) return faLinkedin;
    if (lowerType.includes('twitter') || lowerType.includes('x')) return faTwitter;
    if (lowerType.includes('email') || lowerType.includes('mail')) return faEnvelope;
    return faGlobe;
  };

  // Fix 4: Added type annotation to ensure type safety
  const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...(prev.preferences || {}),
        [key]: value
      }
    }));
  };

  if (loading.profile && !profile.id) {
    return (
        <div className="flex justify-center items-center h-screen">
          <FontAwesomeIcon icon={faSpinner} className="h-8 w-8 text-blue-600 animate-spin" />
        </div>
    );
  }


  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Meu Perfil</h1>
            <p className="text-gray-600">Gerencie suas informações e preferências</p>
            <p className="text-sm text-gray-500 mt-1">
              Membro desde {formatDate(profile.createdAt)}
            </p>
          </div>

          <div className="relative group">
            <div className="h-24 w-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
              {profile.profile.avatar ? (
                <img
                  src={profile.profile.avatar}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-blue-600 text-white text-xl">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <label className="cursor-pointer flex items-center justify-center w-full h-full">
                <FontAwesomeIcon icon={faCamera} className="h-6 w-6 text-white" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarUpdate}
                />
              </label>
            </div>

            {loading.avatar && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full">
                <FontAwesomeIcon icon={faSpinner} className="h-6 w-6 text-white animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faBook} className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Cursos Matriculados</p>
                <p className="text-2xl font-bold">{stats.coursesEnrolled}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faTrophy} className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Cursos Completados</p>
                <p className="text-2xl font-bold">{stats.coursesCompleted}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faTablet} className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Pontuação Total</p>
                <p className="text-2xl font-bold">{stats.totalPoints}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faFire} className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Sequência Atual</p>
                <p className="text-2xl font-bold">{stats.streak} dias</p>
              </div>
            </div>
          </div>
        </div>

        {errors.general && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <FontAwesomeIcon icon={faTimes} className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{errors.general}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-2 px-4 text-center w-1/3 sm:w-auto border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Perfil
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`py-2 px-4 text-center w-1/3 sm:w-auto border-b-2 font-medium text-sm ${
                  activeTab === 'security'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Segurança
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`py-2 px-4 text-center w-1/3 sm:w-auto border-b-2 font-medium text-sm ${
                  activeTab === 'preferences'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Preferências
              </button>
            </nav>
          </div>
        </div>

        {/* Profile Tab Content */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-semibold">Informações do Perfil</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                {errors.profile && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FontAwesomeIcon icon={faTimes} className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{errors.profile}</p>
                      </div>
                    </div>
                  </div>
                )}

                {success.profile && (
                  <div className="bg-green-50 border-l-4 border-green-500 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FontAwesomeIcon icon={faCheck} className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-700">{success.profile}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Nome</label>
                  <input
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                    placeholder="Seu nome completo"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    value={profile.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                  />
                  <p className="text-xs text-gray-500">
                    Para alterar seu email, entre em contato com o suporte.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Biografia</label>
                  <textarea
                    value={profile.profile.bio}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      profile: {
                        ...prev.profile,
                        bio: e.target.value
                      }
                    }))}
                    rows={4}
                    placeholder="Conte um pouco sobre você, suas experiências e interesses..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Links Sociais</label>
                  <div className="space-y-2">
                    {profile.profile.socialLinks?.map((link, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="flex items-center gap-2 bg-gray-50 rounded-l-md px-3 py-2 border border-r-0 border-gray-300">
                          <FontAwesomeIcon icon={getSocialIcon(link.type)} className="h-4 w-4" />
                          <span className="text-sm font-medium">{link.type}</span>
                        </div>
                        <input
                          value={link.url}
                          disabled
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-none rounded-r-md shadow-sm bg-gray-50"
                        />
                        <button
                          type="button"
                          className="px-3 py-2 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          onClick={() => handleSocialLinkRemove(index)}
                        >
                          Remover
                        </button>
                      </div>
                    ))}

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <input
                        placeholder="Tipo (ex: LinkedIn)"
                        value={newSocialLink.type}
                        onChange={(e) => setNewSocialLink(prev => ({
                          ...prev,
                          type: e.target.value
                        }))}
                        className="sm:max-w-[200px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        placeholder="URL"
                        value={newSocialLink.url}
                        onChange={(e) => setNewSocialLink(prev => ({
                          ...prev,
                          url: e.target.value
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        onClick={handleSocialLinkAdd}
                        disabled={!newSocialLink.type || !newSocialLink.url}
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading.profile}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading.profile ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      'Salvar Alterações'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Security Tab Content */}
       {activeTab === 'security' && (
  <div className="bg-white rounded-lg shadow">
    <div className="border-b border-gray-200 px-6 py-4">
      <h2 className="text-xl font-semibold">Alterar Senha</h2>
    </div>
    <div className="p-6">
      <form onSubmit={handlePasswordUpdate} className="space-y-4">
        {errors.password && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FontAwesomeIcon icon={faTimes} className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{errors.password}</p>
              </div>
            </div>
          </div>
        )}

        {success.password && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FontAwesomeIcon icon={faCheck} className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success.password}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Senha Atual</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faLock} className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              value={password.current}
              onChange={(e) => setPassword(prev => ({
                ...prev,
                current: e.target.value
              }))}
              placeholder="Digite sua senha atual"
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Nova Senha</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faLock} className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              value={password.new}
              onChange={(e) => setPassword(prev => ({
                ...prev,
                new: e.target.value
              }))}
              placeholder="Digite sua nova senha"
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Confirmar Nova Senha</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faLock} className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              value={password.confirm}
              onChange={(e) => setPassword(prev => ({
                ...prev,
                confirm: e.target.value
              }))}
              placeholder="Confirme sua nova senha"
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="pt-2">
          <p className="text-sm text-gray-600 mb-4">Sua senha deve conter:</p>
          <ul className="space-y-1 text-sm text-gray-600">
            <li className={`flex items-center ${password.new.length >= 8 ? 'text-green-600' : ''}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${password.new.length >= 8 ? 'bg-green-600' : 'bg-gray-400'}`}></div>
              No mínimo 8 caracteres
            </li>
            <li className={`flex items-center ${/[A-Z]/.test(password.new) ? 'text-green-600' : ''}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${/[A-Z]/.test(password.new) ? 'bg-green-600' : 'bg-gray-400'}`}></div>
              Uma letra maiúscula
            </li>
            <li className={`flex items-center ${/[0-9]/.test(password.new) ? 'text-green-600' : ''}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${/[0-9]/.test(password.new) ? 'bg-green-600' : 'bg-gray-400'}`}></div>
              Um número
            </li>
            <li className={`flex items-center ${/[^A-Za-z0-9]/.test(password.new) ? 'text-green-600' : ''}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${/[^A-Za-z0-9]/.test(password.new) ? 'bg-green-600' : 'bg-gray-400'}`}></div>
              Um caractere especial
            </li>
          </ul>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading.password ||
              !password.current ||
              !password.new ||
              !password.confirm ||
              password.new !== password.confirm ||
              password.new.length < 8 ||
              !/[A-Z]/.test(password.new) ||
              !/[0-9]/.test(password.new) ||
              !/[^A-Za-z0-9]/.test(password.new)}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading.password ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="mr-2 h-4 w-4 animate-spin" />
                Atualizando...
              </>
            ) : (
              'Atualizar Senha'
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

{/* Preferences Tab Content */}
        {activeTab === 'preferences' && (
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-semibold">Preferências</h2>
              </div>
              <div className="p-6">
                <form onSubmit={handlePreferencesUpdate} className="space-y-4">
                  {errors.preferences && (
                      <div className="bg-red-50 border-l-4 border-red-500 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <FontAwesomeIcon icon={faTimes} className="h-5 w-5 text-red-500" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-red-700">{errors.preferences}</p>
                          </div>
                        </div>
                      </div>
                  )}

                  {success.preferences && (
                      <div className="bg-green-50 border-l-4 border-green-500 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <FontAwesomeIcon icon={faCheck} className="h-5 w-5 text-green-500" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-green-700">{success.preferences}</p>
                          </div>
                        </div>
                      </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Notificações</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                                id="email-notifications"
                                type="checkbox"
                                checked={profile.preferences?.emailNotifications ?? true}
                                onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="email-notifications" className="font-medium text-gray-700">
                              Notificações por email
                            </label>
                            <p className="text-gray-500">
                              Receba emails sobre novos conteúdos, atualizações e lembretes de estudo
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Aparência</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                                id="dark-mode"
                                type="checkbox"
                                checked={profile.preferences?.darkMode ?? false}
                                onChange={(e) => handlePreferenceChange('darkMode', e.target.checked)}
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="dark-mode" className="font-medium text-gray-700 flex items-center">
                              <FontAwesomeIcon icon={faMoon} className="h-4 w-4 mr-1" />
                              Modo escuro
                            </label>
                            <p className="text-gray-500">
                              Ativar tema escuro para reduzir o cansaço visual
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Idioma e Região</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <FontAwesomeIcon icon={faLanguage} className="h-4 w-4 mr-1" />
                            Idioma
                          </label>
                          <select
                              value={profile.preferences?.language ?? 'pt-BR'}
                              onChange={(e) => handlePreferenceChange('language', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="pt-BR">Português (Brasil)</option>
                            <option value="en-US">English (US)</option>
                            <option value="es">Español</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <FontAwesomeIcon icon={faClock} className="h-4 w-4 mr-1" />
                            Fuso Horário
                          </label>
                          <select
                              value={profile.preferences?.timezone ?? 'America/Sao_Paulo'}
                              onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="America/Sao_Paulo">América/São Paulo (GMT-3)</option>
                            <option value="America/New_York">América/Nova York (GMT-5)</option>
                            <option value="Europe/London">Europa/Londres (GMT+0)</option>
                            <option value="Europe/Lisbon">Europa/Lisboa (GMT+0)</option>
                            <option value="America/Los_Angeles">América/Los Angeles (GMT-8)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading.profile}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {loading.profile ? (
                          <>
                            <FontAwesomeIcon icon={faSpinner} className="mr-2 h-4 w-4 animate-spin" />
                            Salvando...
                          </>
                      ) : (
                          'Salvar Preferências'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}

        </div>
        </div>
    );
    };

export default ProfilePage;
