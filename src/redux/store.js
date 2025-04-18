import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice'; // Теперь импорт будет работать
import authReducer from './authSlice';
import feedbackReducer from './feedbackSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    feedbacks: feedbackReducer
  }
});
export default store;