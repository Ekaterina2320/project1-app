import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3001/users';

// Асинхронное действие для регистрации
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      // Проверяем, нет ли уже пользователя с таким email
      const response = await axios.get(`${API_URL}?email=${userData.email}`);
      if (response.data.length > 0) {
        return rejectWithValue('Пользователь с таким email уже существует');
      }

      // Создаем нового пользователя
      const newUserResponse = await axios.post(API_URL, userData);
      return newUserResponse.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Асинхронное действие для входа
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}?email=${credentials.email}`);
      if (response.data.length === 0 || response.data[0].password !== credentials.password) {
        return rejectWithValue('Неверный email или пароль');
      }
      return response.data[0];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Асинхронное действие для обновления профиля
export const updateUser = createAsyncThunk(
  'auth/update',
  async (userData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const currentUser = auth.currentUser;

      // Сохраняем важные поля, которые не должны изменяться
      const updatedUser = {
        ...currentUser, // сохраняем текущие данные
        ...userData,   // применяем новые данные
        password: userData.password || currentUser.password, // сохраняем пароль
        id: currentUser.id // гарантируем сохранение id
      };

      // Обновляем пользователя на сервере
      const response = await axios.put(`${API_URL}/${currentUser.id}`, updatedUser);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ... (остальная часть slice остается без изменений)

const initialState = {
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  registeredUsers: JSON.parse(localStorage.getItem('registeredUsers')) || []
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      localStorage.removeItem('currentUser');
    },
    clearError: (state) => {
      state.error = null;
    },
    // Синхронный редьюсер для обновления данных в localStorage
    updateLocalUser: (state, action) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
        localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Обработчики для регистрации
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        state.registeredUsers.push(action.payload);
        localStorage.setItem('currentUser', JSON.stringify(action.payload));
        localStorage.setItem('registeredUsers', JSON.stringify(state.registeredUsers));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Обработчики для входа
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        localStorage.setItem('currentUser', JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Обработчики для обновления профиля
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;

        // Обновляем пользователя в списке зарегистрированных
        const userIndex = state.registeredUsers.findIndex(
          user => user.id === action.payload.id
        );
        if (userIndex !== -1) {
          state.registeredUsers[userIndex] = action.payload;
          localStorage.setItem('registeredUsers', JSON.stringify(state.registeredUsers));
        }

        localStorage.setItem('currentUser', JSON.stringify(action.payload));
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { logoutUser, clearError, updateLocalUser } = authSlice.actions;
export default authSlice.reducer;
