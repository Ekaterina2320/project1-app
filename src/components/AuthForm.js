import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, loginUser } from '../redux/authSlice';

const AuthForm = ({ isLogin, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm();

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(state => state.auth);
  const [localError, setLocalError] = useState(null);

  const onSubmit = async (data) => {
    setLocalError(null);
    try {
      if (isLogin) {
        await dispatch(loginUser(data)).unwrap();
      } else {
        await dispatch(registerUser(data)).unwrap();
      }
      reset();
      onSuccess();
    } catch (error) {
      setLocalError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
      {!isLogin && (
        <div className="form-group">
          <label>Имя</label>
          <input
            {...register('name', { required: 'Обязательное поле' })}
            className="form-input"
          />
          {errors.name && <span className="error">{errors.name.message}</span>}
        </div>
      )}

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          {...register('email', {
            required: 'Обязательное поле',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Некорректный email'
            }
          })}
          className="form-input"
        />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </div>

      <div className="form-group">
        <label>Пароль</label>
        <input
          type="password"
          {...register('password', {
            required: 'Обязательное поле',
            minLength: {
              value: 6,
              message: 'Минимум 6 символов'
            }
          })}
          className="form-input"
        />
        {errors.password && <span className="error">{errors.password.message}</span>}
      </div>

      {!isLogin && (
        <div className="form-group">
          <label>Подтвердите пароль</label>
          <input
            type="password"
            {...register('confirmPassword', {
              validate: value =>
                value === watch('password') || 'Пароли не совпадают'
            })}
            className="form-input"
          />
          {errors.confirmPassword && (
            <span className="error">{errors.confirmPassword.message}</span>
          )}
        </div>
      )}

      {(error || localError) && (
        <div className="error-message">{error || localError}</div>
      )}

      <button
        type="submit"
        className="submit-btn"
        disabled={isLoading}
      >
        {isLoading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
      </button>
    </form>
  );
};

export default AuthForm;