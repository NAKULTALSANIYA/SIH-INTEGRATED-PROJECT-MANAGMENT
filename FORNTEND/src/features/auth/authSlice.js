import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authApi from '../../api/authApi';
import { APP_CONFIG } from '../../utils/constants';
import { storage } from '../../utils/storage';

const storedToken = storage.get(APP_CONFIG.TOKEN_KEY, 'gov_token_admin_usr-gov-001');
const storedUser = storage.get(APP_CONFIG.USER_KEY, {
  id: 'usr-gov-001',
  name: 'Shri R. K. Verma, IAS',
  email: 'admin@gov.in',
  role: 'ADMIN',
  department: 'PMO - Infrastructure Monitoring Group',
  designation: 'Joint Secretary & Project Director',
});

const initialState = {
  user: storedUser,
  token: storedToken,
  isAuthenticated: Boolean(storedToken),
  isLoading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authApi.login(credentials);
      storage.set(APP_CONFIG.TOKEN_KEY, data.token);
      storage.set(APP_CONFIG.USER_KEY, data.user);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Login failed. Verify credentials.');
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authApi.getProfile();
      storage.set(APP_CONFIG.USER_KEY, user);
      return user;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch user profile');
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      storage.remove(APP_CONFIG.TOKEN_KEY);
      storage.remove(APP_CONFIG.USER_KEY);
    },
    switchRoleDemo: (state, action) => {
      const role = action.payload; // 'ADMIN' | 'VIEWER'
      if (role === 'ADMIN') {
        state.user = {
          id: 'usr-gov-001',
          name: 'Shri R. K. Verma, IAS',
          email: 'admin@gov.in',
          role: 'ADMIN',
          department: 'PMO - Infrastructure Monitoring Group',
          designation: 'Joint Secretary & Project Director',
        };
        state.token = 'gov_token_admin_usr-gov-001';
      } else {
        state.user = {
          id: 'usr-gov-002',
          name: 'Dr. Ananya Iyer',
          email: 'viewer@gov.in',
          role: 'VIEWER',
          department: 'NITI Aayog / Citizen Audit Wing',
          designation: 'Principal Project Evaluator',
        };
        state.token = 'gov_token_viewer_usr-gov-002';
      }
      state.isAuthenticated = true;
      storage.set(APP_CONFIG.TOKEN_KEY, state.token);
      storage.set(APP_CONFIG.USER_KEY, state.user);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logout, switchRoleDemo, clearError } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsAdmin = (state) => state.auth.user?.role === 'ADMIN';
export const selectUserRole = (state) => state.auth.user?.role || 'VIEWER';
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
