import AppRouter from './routes';
import { useEffect } from 'react';
import { useAppDispatch } from './store/slices/hooks';
import authService from './services/auth.service';
import { setUser, clearUser } from './store/slices/authSlice';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Verificar se o usuário já está autenticado (token no localStorage)
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          dispatch(setUser(user));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        dispatch(clearUser());
        localStorage.removeItem('token');
      }
    };

    checkAuth();
  }, [dispatch]);

  return <AppRouter />;
}

export default App;
