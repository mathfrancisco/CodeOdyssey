import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/slices/hooks';
import { clearUser } from '../../store/slices/authSlice';
import { useState } from 'react';
import authService from '../../services/auth.service';

const Navbar = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
    dispatch(clearUser());
  };

  return (
    <nav className="bg-primary-700 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">CodeOdyssey</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="hover:text-primary-200 transition duration-200">
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:text-primary-200 transition duration-200">
                  Dashboard
                </Link>
                <div className="relative group">
                  <button className="hover:text-primary-200 transition duration-200 flex items-center">
                    <span className="mr-1">{user?.profile?.name || 'Usuário'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sair
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-primary-200 transition duration-200">
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-primary-700 px-4 py-2 rounded-md hover:bg-gray-100 transition duration-200"
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
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <Link to="/" className="block py-2 hover:text-primary-200" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block py-2 hover:text-primary-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="block py-2 hover:text-primary-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Perfil
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 hover:text-primary-200"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 hover:text-primary-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="block py-2 hover:text-primary-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
