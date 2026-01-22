import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { LoginCredentials } from '@/types/incident';
import { RootState } from '@/app/store';
import { authAPI } from './authAPI';

function getJwtExp(token: string): number | null {
  try {
    const payload = token.split('.')[1];
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return typeof json?.exp === 'number' ? json.exp : null; // epoch seconds
  } catch {
    return null;
  }
}

interface AuthState {
  token: string | null;
  expiresAt: number | null; // epoch seconds
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  username: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('accessToken'),
  expiresAt: localStorage.getItem('accessTokenExp')
    ? Number(localStorage.getItem('accessTokenExp'))
    : null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading: false,
  error: null,
  username: localStorage.getItem('username'),
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const data = await authAPI.login(credentials); // { accessToken: string }
      const token = data.accessToken as string;
      const exp = getJwtExp(token);

      localStorage.setItem('accessToken', token);
      if (exp) localStorage.setItem('accessTokenExp', String(exp));
      localStorage.setItem('username', credentials.username);

      return { token, expiresAt: exp, username: credentials.username };
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

// authSlice.ts
export const refreshAccessToken = createAsyncThunk(
  'auth/refreshAccessToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const currentToken =
        state.auth.token || localStorage.getItem('accessToken');

      if (!currentToken) {
        return rejectWithValue('No access token to refresh');
      }

      const data = await authAPI.refresh(currentToken); 

      const newToken = data.accessToken as string;
      const exp = getJwtExp(newToken);

      localStorage.setItem('accessToken', newToken);
      if (exp) localStorage.setItem('accessTokenExp', String(exp));

      return { token: newToken, expiresAt: exp };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Refresh failed'
      );
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
      return true;
    } catch (error: any) {
      return rejectWithValue('Logout failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setToken: (
      state,
      action: PayloadAction<{ token: string; expiresAt: number | null }>
    ) => {
      state.token = action.payload.token;
      state.expiresAt = action.payload.expiresAt;
      state.isAuthenticated = true;

      localStorage.setItem('accessToken', action.payload.token);
      if (action.payload.expiresAt) {
        localStorage.setItem('accessTokenExp', String(action.payload.expiresAt));
      } else {
        localStorage.removeItem('accessTokenExp');
      }
    },
    clearAuth: (state) => {
      state.token = null;
      state.expiresAt = null;
      state.isAuthenticated = false;
      state.username = null;

      localStorage.removeItem('accessToken');
      localStorage.removeItem('accessTokenExp');
      localStorage.removeItem('username');
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.expiresAt = action.payload.expiresAt;
      state.username = action.payload.username;
      state.error = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.token = null;
      state.expiresAt = null;
      state.error = action.payload as string;
    });

    // Refresh
    builder.addCase(refreshAccessToken.fulfilled, (state, action) => {
      state.token = action.payload.token;
      state.expiresAt = action.payload.expiresAt;
      state.isAuthenticated = true;
    });
    builder.addCase(refreshAccessToken.rejected, (state) => {
      state.token = null;
      state.expiresAt = null;
      state.isAuthenticated = false;
      state.username = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('accessTokenExp');
      localStorage.removeItem('username');
    });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.token = null;
      state.expiresAt = null;
      state.isAuthenticated = false;
      state.username = null;
      state.error = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('accessTokenExp');
      localStorage.removeItem('username');
    });
  },
});

export const { clearError, setToken, clearAuth } = authSlice.actions;

// Selectors
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectUsername = (state: RootState) => state.auth.username;

export default authSlice.reducer;
