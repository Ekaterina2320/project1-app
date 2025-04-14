import { createSlice } from '@reduxjs/toolkit';

const loadUsersFromLocalStorage = () => {
  const users = localStorage.getItem('registeredUsers');
  return users ? JSON.parse(users) : [];
};

const initialState = {
  isAuthenticated: false,
  currentUser: null,
  registeredUsers: loadUsersFromLocalStorage()
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerUser: (state, action) => {
      const newUser = action.payload;
      // Проверяем, нет ли уже пользователя с таким email
      const userExists = state.registeredUsers.some(user => user.email === newUser.email);

      if (!userExists) {
        state.registeredUsers.push(newUser);
        state.currentUser = newUser;
        state.isAuthenticated = true;
        localStorage.setItem('registeredUsers', JSON.stringify(state.registeredUsers));
      }
    },
    loginUser: (state, action) => {
      const { email, password } = action.payload;
      const user = state.registeredUsers.find(
        user => user.email === email && user.password === password
      );

      if (user) {
        state.currentUser = user;
        state.isAuthenticated = true;
      }
    },
    logoutUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    }
  }
});

export const { registerUser, loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;