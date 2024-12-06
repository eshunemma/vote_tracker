import React from 'react';
import { useAuthGuard } from '../../utils/auth';
import { RouteGuardProps } from '../../types';

export function AuthGuard({ children }: RouteGuardProps) {
  const currentAgent = useAuthGuard();
  
  if (!currentAgent) {
    return null;
  }

  return <>{children}</>;
}