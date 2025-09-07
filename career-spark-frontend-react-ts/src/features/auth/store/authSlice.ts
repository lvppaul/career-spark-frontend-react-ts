import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  id: string | null;
  role: 'admin' | 'user' | null;
  email: string | null;
  name: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  id: null,
  role: null,
  email: null,
  name: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        token: string;
        user: Omit<AuthState, 'isAuthenticated' | 'token'>;
      }>
    ) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.id = action.payload.user.id;
      state.role = action.payload.user.role;
      state.email = action.payload.user.email;
      state.name = action.payload.user.name;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.id = null;
      state.role = null;
      state.email = null;
      state.name = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
