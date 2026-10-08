import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './routes/AppRouter';

export const App = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};

export default App;
