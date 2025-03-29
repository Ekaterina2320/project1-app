import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';

export const AuthForm = ({ isLogin, onSuccess }) => {
  const { register, handleSubmit, setError, clearErrors } = useForm();
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    if (data.login === 'admin' && data.password === 'admin') {
      dispatch(login({ login: data.login }));
      localStorage.setItem('user', JSON.stringify({ login: data.login }));
      clearErrors();
      onSuccess();
    } else {
      setError('login', { type: 'manual', message: 'Invalid login or password' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Login</label>
        <input {...register('login')} />
      </div>
      <div>
        <label>Password</label>
        <input type="password" {...register('password')} />
      </div>
      <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
    </form>
  );
};