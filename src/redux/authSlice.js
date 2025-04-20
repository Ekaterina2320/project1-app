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

      // Создаем нового пользователя с ролью по умолчанию
      const newUser = {
        ...userData,
        role: 'user', // Устанавливаем роль по умолчанию
        isBlocked: false // Добавляем статус блокировки
      };
      // Отправка запроса на создание пользователя
      const newUserResponse = await axios.post(API_URL, newUser);
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
      // Проверки перед авторизацией:
      // 1. Пользователь существует
      // 2. Пароль верный
      // 3. Пользователь не заблокирован
      if (response.data.length === 0 ||
          response.data[0].password !== credentials.password ||
          response.data[0].isBlocked) {
        return rejectWithValue('Неверный email или пароль, либо пользователь заблокирован');
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
        ...currentUser,
        ...userData,
        password: userData.password || currentUser.password, // Пароль остается прежним, если не указан новый
        id: currentUser.id, // ID не меняется
        role: currentUser.role, // Роль не меняется
        isBlocked: currentUser.isBlocked // Статус блокировки не меняется
      };
      // Отправка запроса на обновление
      const response = await axios.put(`${API_URL}/${currentUser.id}`, updatedUser);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Асинхронное действие для получения списка пользователей (админ)
export const fetchUsers = createAsyncThunk(
  'auth/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Асинхронное действие для изменения роли пользователя (админ)
export const updateUserRole = createAsyncThunk(
  'auth/updateRole',
  async ({ userId, newRole }, { rejectWithValue }) => {
    try {
    // Получаем текущие данные пользователя
      const userResponse = await axios.get(`${API_URL}/${userId}`);
      // Создаем обновленного пользователя с новой ролью
      const updatedUser = {
        ...userResponse.data,
        role: newRole
      };
      // Отправляем обновленные данные
      const response = await axios.put(`${API_URL}/${userId}`, updatedUser);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Асинхронное действие для удаления пользователя (админ)
export const deleteUser = createAsyncThunk(
  'auth/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${userId}`);
      return userId; // Возвращаем ID удаленного пользователя
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Асинхронное действие для блокировки/разблокировки пользователя (админ)
export const blockUser = createAsyncThunk(
  'auth/blockUser',
  async ({ userId, isBlocked }, { rejectWithValue }) => {
    try {
      // Отправляем PATCH запрос для изменения статуса блокировки
      const response = await axios.patch(`${API_URL}/${userId}`, { isBlocked });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  users: [],
  usersLoading: false,
  usersError: null,
  registeredUsers: JSON.parse(localStorage.getItem('registeredUsers')) || []
};
// Создание Redux slice для управления состоянием аутентификации
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
  // Действие для выхода пользователя
    logoutUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      localStorage.removeItem('currentUser');
    },
    // Действие для очистки ошибок
    clearError: (state) => {
      state.error = null;
    },
    // Действие для локального обновления данных пользователя (без запроса к API)
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
      })

      // Обработчики для получения списка пользователей
      .addCase(fetchUsers.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload;
      })

      // Обработчики для изменения роли пользователя
      .addCase(updateUserRole.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.usersLoading = false;
        const userIndex = state.users.findIndex(user => user.id === action.payload.id);
        if (userIndex !== -1) {
          state.users[userIndex] = action.payload;
        }
        // Если это текущий пользователь - обновляем и его данные
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser = action.payload;
          localStorage.setItem('currentUser', JSON.stringify(action.payload));
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload;
      })

      // Обработчики для удаления пользователя
      .addCase(deleteUser.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.usersLoading = false;
        // Удаляем пользователя из всех списков
        state.users = state.users.filter(user => user.id !== action.payload);
        state.registeredUsers = state.registeredUsers.filter(user => user.id !== action.payload);
        // Если это текущий пользователь - разлогиниваем
        if (state.currentUser?.id === action.payload) {
          state.currentUser = null;
          state.isAuthenticated = false;
          localStorage.removeItem('currentUser');
        }
        localStorage.setItem('registeredUsers', JSON.stringify(state.registeredUsers));
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload;
      })

      // Обработчики для блокировки пользователя
      .addCase(blockUser.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(blockUser.fulfilled, (state, action) => {
        state.usersLoading = false;
        // Обновляем пользователя в общем списке
        const userIndex = state.users.findIndex(u => u.id === action.payload.id);
        if (userIndex !== -1) {
          state.users[userIndex] = action.payload;
        }
        // Если это текущий пользователь - обновляем и его данные
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser = action.payload;
          localStorage.setItem('currentUser', JSON.stringify(action.payload));
        }
      })
      .addCase(blockUser.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload;
      });
  }
});

export const { logoutUser, clearError, updateLocalUser } = authSlice.actions;
export default authSlice.reducer;