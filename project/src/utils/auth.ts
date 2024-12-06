import { useStore } from '../store/useStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export const useAuthGuard = () => {
  const currentAgent = useStore(state => state.currentAgent);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!currentAgent && location.pathname !== '/') {
      navigate('/', { replace: true });
    }
  }, [currentAgent, navigate, location]);

  return currentAgent;
};