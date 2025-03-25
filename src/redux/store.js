// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice'; // Теперь импорт будет работать

export const store = configureStore({
  reducer: {
    counter: counterReducer
  }
});
export default store;