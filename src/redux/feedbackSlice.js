import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3001/feedbacks';

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

export const addFeedback = createAsyncThunk(
  'feedbacks/add',
  async (feedback, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
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

const initialState = {
  items: [],
  loading: false,
  error: null
};

const feedbackSlice = createSlice({
  name: 'feedbacks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      .addCase(addFeedback.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  }
});

export default feedbackSlice.reducer;