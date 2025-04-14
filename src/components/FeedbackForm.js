import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';

const FeedbackForm = ({ addFeedback }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = useCallback((data) => {
    addFeedback(data);
    reset();
  }, [addFeedback, reset]);

  return (
    <div className="feedback-container">
      <h2 className="feedback-title">Оставить отзыв</h2>
      <form className="feedback-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label className="form-label">Ваше имя:</label>
          <input
            className="form-input"
            {...register('name', { required: 'Поле обязательно для заполнения' })}
          />
          {errors.name && <span className="form-error">{errors.name.message}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Ваш отзыв:</label>
          <textarea
            className="form-input"
            rows="4"
            {...register('feedback', { required: 'Поле обязательно для заполнения' })}
          />
          {errors.feedback && <span className="form-error">{errors.feedback.message}</span>}
        </div>
        <button
          type="submit"
          className="feedback-submit-btn"
        >
          Отправить отзыв
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;