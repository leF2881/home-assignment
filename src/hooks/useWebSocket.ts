import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectIsAuthenticated } from '@/features/auth/authSlice';
import {
  connecting,
  connected,
  disconnected,
  connectionError
} from '@/features/connection/connectionSlice';
import { updateIncident } from '@/features/incidents/incidentsSlice';
import { websocketService } from '@/features/connection/websocketService';

export function useWebSocket() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      websocketService.disconnect();
      dispatch(disconnected());
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('No access token found');
      dispatch(disconnected()); 
      return;
    }

    console.log('🚀 Initializing WebSocket connection...');
    dispatch(connecting()); 

    websocketService.connect(token);

    const unsubscribe = websocketService.subscribe((event) => {
      switch (event.type) {
        case 'connecting':
          dispatch(connecting());
          break;

        case 'connected':
          console.log('✅ WebSocket connected');
          dispatch(connected());
          break;

        case 'disconnected':
          console.log('❌ WebSocket disconnected');
          dispatch(disconnected());
          break;

        case 'error':
          console.error('🔴 WebSocket error:', event.error);
          dispatch(connectionError(event.error));
          break;

        case 'incident_update':
          dispatch(updateIncident(event.data));
          break;
      }
    });

    return () => {
      console.log('🔌 Cleaning up WebSocket...');
      unsubscribe();
      websocketService.disconnect();
      dispatch(disconnected());
    };
  }, [isAuthenticated, dispatch]);
}
