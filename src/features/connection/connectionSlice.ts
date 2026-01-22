import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/app/store';

interface ConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  lastConnected: number | null;
  reconnectAttempts: number;
}

const initialState: ConnectionState = {
  isConnected: false,    
  isConnecting: false,
  error: null,
  lastConnected: null,
  reconnectAttempts: 0,
};

const connectionSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    connecting: (state) => {
      state.isConnecting = true;   
      state.isConnected = false;  
      state.error = null;
    },
    connected: (state) => {
      state.isConnected = true;
      state.isConnecting = false;
      state.error = null;
      state.lastConnected = Date.now();
      state.reconnectAttempts = 0;
    },
    disconnected: (state) => {
      state.isConnected = false;
      state.isConnecting = false;
    },
    connectionError: (state, action: PayloadAction<string>) => {
      state.isConnected = false;
      state.isConnecting = false;
      state.error = action.payload;
    },
    incrementReconnectAttempts: (state) => {
      state.reconnectAttempts += 1;
    },
    resetReconnectAttempts: (state) => {
      state.reconnectAttempts = 0;
    },
  },
});

export const {
  connecting,
  connected,
  disconnected,
  connectionError,
  incrementReconnectAttempts,
  resetReconnectAttempts,
} = connectionSlice.actions;

export const selectIsConnected = (state: RootState) => state.connection.isConnected;
export const selectIsConnecting = (state: RootState) => state.connection.isConnecting;
export const selectConnectionError = (state: RootState) => state.connection.error;

export default connectionSlice.reducer;
