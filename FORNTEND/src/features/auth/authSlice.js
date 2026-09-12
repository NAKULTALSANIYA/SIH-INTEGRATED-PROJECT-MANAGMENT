import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authApi from '../../api/authApi';
import { APP_CONFIG } from '../../utils/constants';
import { storage } from '../../utils/storage';

// Get cached credentials or initialize default guest/demo session
const storedToken = storage.get(APP_CONFIG.TOKEN_KEY, 'demo-jwt-token-sih-2026');
const storedUser = storage.get(APP_CONFIG.USER_KEY, {
  id: 'usr-1',
  name: 'Nakul Talsaniya',
  email: 'nakul@sih.gov.in',
  role: 'Project Manager',
  avatar: null,
});

const initialState = {
  user: storedUser,
  token: storedToken,
  isAuthenticated: Boolean(storedToken),
  isLoading: false,
  error: null,
};

// Async Thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      storage.set(APP_CONFIG.TOKEN_KEY, response.token);
      storage.set(APP_CONFIG.USER_KEY, response.user);
      return response;
    } catch (err) {
      // Fallback for offline/demo development
      if (!err.status) {
        const demoUser = {
          id: 'usr-1',
          name: credentials.email.split('@')[0] || 'Demo User',
          email: credentials.email,
          role: 'Project Manager',
        };
        const demoToken = 'demo-token-' + Date.now();
        storage.set(APP_CONFIG.TOKEN_KEY, demoToken);
        storage.set(APP_CONFIG.USER_KEY, demoUser);
        return { user: demoUser, token: demoToken };
      }
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      storage.set(APP_CONFIG.TOKEN_KEY, response.token);
      storage.set(APP_CONFIG.USER_KEY, response.user);
      return response;
    } catch (err) {
      return rejectWithValue(err.message || 'Registration failed');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getProfile();
      return response;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch profile');
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      storage.set(APP_CONFIG.TOKEN_KEY, token);
      storage.set(APP_CONFIG.USER_KEY, user);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      storage.remove(APP_CONFIG.TOKEN_KEY);
      storage.remove(APP_CONFIG.USER_KEY);
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Profile
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { setCredentials, logout, clearAuthError } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
