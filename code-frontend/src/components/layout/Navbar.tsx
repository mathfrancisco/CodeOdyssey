import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/slices/hooks';
import { clearUser } from '../../store/slices/authSlice';
import { useState, useEffect } from 'react';
import authService from '../../services/auth.service';

const Navbar = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleLogout = () => {
    authService.logout();
    dispatch(clearUser());
    setIsMenuOpen(false);
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 backdrop-blur-md text-slate-800 shadow-lg'
        : 'bg-gradient-to-r from-blue-900 to-blue-800 text-white'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className={`flex items-center justify-center w-9 h-9 rounded-lg ${
              scrolled 
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/20' 
                : 'bg-beige-100/20 backdrop-blur-sm'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <span className={`text-xl font-bold ${
              scrolled 
                ? 'bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent' 
                : 'text-beige-100'
            }`}>CodeOdyssey</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`transition duration-200 font-medium ${
              scrolled ? 'hover:text-blue-600' : 'hover:text-beige-200 text-beige-100'
            }`}>
              Home
            </Link>
            <Link to="/courses" className={`transition duration-200 font-medium ${
              scrolled ? 'hover:text-blue-600' : 'hover:text-beige-200 text-beige-100'
            }`}>
              Cursos
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className={`transition duration-200 font-medium ${
                  scrolled ? 'hover:text-blue-600' : 'hover:text-beige-200 text-beige-100'
                }`}>
                  Dashboard
                </Link>
                <div className="relative group">
                  <button className={`transition duration-200 flex items-center space-x-1 font-medium ${
                    scrolled ? 'hover:text-blue-600' : 'hover:text-beige-200 text-beige-100'
                  }`}>
                    <span>{user?.profile || 'Usuário'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-xl py-2 z-10 hidden group-hover:block transform opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100 origin-top-right border border-blue-100">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-beige-50 hover:text-blue-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Perfil
                    </Link>
                    <Link
                      to="/achievements"
                      className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-beige-50 hover:text-blue-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-beige-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      Conquistas
                    </Link>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sair
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className={`transition duration-200 font-medium ${
                  scrolled ? 'hover:text-blue-600' : 'hover:text-beige-200 text-beige-100'
                }`}>
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className={`px-4 py-2 rounded-lg transition duration-300 font-medium ${
                    scrolled
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/30'
                      : 'bg-beige-100/20 backdrop-blur-sm text-beige-100 hover:bg-beige-100/30'
                  }`}
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden absolute inset-x-0 z-10 transition-all duration-300 transform ${
          isMenuOpen
            ? 'translate-y-0 opacity-100 visible'
            : '-translate-y-4 opacity-0 invisible'
        }`}>
          <div className="bg-white/95 backdrop-blur-md shadow-xl rounded-b-xl mx-4 p-4 mt-2">
            <Link to="/" className="flex items-center py-3 text-slate-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
            <Link to="/courses" className="flex items-center py-3 text-slate-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-beige-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
              Cursos
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center py-3 text-slate-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center py-3 text-slate-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-beige-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Perfil
                </Link>
                <Link
                  to="/achievements"
                  className="flex items-center py-3 text-slate-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Conquistas
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full py-3 text-red-600 hover:text-red-800"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sair
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-3 mt-2">
                <Link
                  to="/login"
                  className="flex items-center justify-center py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Entrar</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center justify-center py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md hover:shadow-lg hover:shadow-blue-500/20"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Cadastrar</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
