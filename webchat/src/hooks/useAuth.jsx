import { useContext } from 'react';
// Phải import trực tiếp AuthContext, không phải file index của context
import { AuthContext } from '../context/AuthContext'; 

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
  
};
