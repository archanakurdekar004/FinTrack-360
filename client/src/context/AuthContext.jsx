import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('fintrack_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('fintrack_token'));
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(token));
  const [loading, setLoading] = useState(true);

  // Authenticated session verification on app mount / token change
  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      const storedToken = localStorage.getItem('fintrack_token');
      if (!storedToken) {
        if (isMounted) {
          setUser(null);
          setToken(null);
          setIsAuthenticated(false);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await authService.getCurrentUser();
        if (isMounted) {
          const freshUser = response?.data?.user;
          setUser(freshUser);
          setIsAuthenticated(true);
          if (freshUser) {
            localStorage.setItem('fintrack_user', JSON.stringify(freshUser));
          }
        }
      } catch (_error) {
        // Token invalid or expired - reset session state
        if (isMounted) {
          authService.logout();
          setUser(null);
          setToken(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    verifySession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    const { user: userData, token: authToken } = response.data;

    setUser(userData);
    setToken(authToken);
    setIsAuthenticated(true);

    localStorage.setItem('fintrack_token', authToken);
    localStorage.setItem('fintrack_user', JSON.stringify(userData));

    return response;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    const { user: newUser, token: authToken } = response.data;

    setUser(newUser);
    setToken(authToken);
    setIsAuthenticated(true);

    localStorage.setItem('fintrack_token', authToken);
    localStorage.setItem('fintrack_user', JSON.stringify(newUser));

    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (data) => {
    const response = await authService.updateProfile(data);
    const updatedUser = response.data.user;
    setUser(updatedUser);
    localStorage.setItem('fintrack_user', JSON.stringify(updatedUser));
    return response;
  };

  const updatePassword = async (data) => {
    return await authService.updatePassword(data);
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
