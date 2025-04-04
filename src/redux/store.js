import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice'; // Теперь импорт будет работать
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer
  }
});
export default store;