import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3001/feedbacks';
// Экшен для получения всех отзывов
export const fetchFeedbacks = createAsyncThunk(
  'feedbacks/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// Экшен для добавления отзыва
export const addFeedback = createAsyncThunk(
  'feedbacks/add',
  async (feedback, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      // Формируем полный объект отзыва:
      // - Добавляем ID текущего пользователя
      // - Устанавливаем текущую дату
      const newFeedback = {
        ...feedback,
        userId: auth.currentUser.id,
        date: new Date().toISOString()
      };
      const response = await axios.post(API_URL, newFeedback);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// Экшен для удаления отзыва
export const deleteFeedback = createAsyncThunk(
  'feedbacks/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// Экшен для блокировки отзыва
export const blockFeedback = createAsyncThunk(
  'feedbacks/block',
  async ({ id, isBlocked }, { rejectWithValue }) => {
    try {
      // Используем PATCH для частичного обновления (только isBlocked)
      const response = await axios.patch(`${API_URL}/${id}`, { isBlocked });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// Начальное состояние хранилища для отзывов
const initialState = {
  items: [],
  loading: false,
  error: null
};
// Создание Redux slice для управления состоянием отзывов
const feedbackSlice = createSlice({
  name: 'feedbacks',
  initialState,
  reducers: {},
  // Обработчики асинхронных экшенов
  extraReducers: (builder) => {
    builder
      // Обработка состояний для получения отзывов
      .addCase(fetchFeedbacks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFeedbacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Обработка успешного добавления отзыва
      .addCase(addFeedback.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Обработка успешного удаления отзыва
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      // Обработка успешной блокировки/разблокировки отзыва
      .addCase(blockFeedback.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  }
});

export default feedbackSlice.reducer;