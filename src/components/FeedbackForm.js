import React from 'react';
import { useForm } from 'react-hook-form';

const FeedbackForm = ({ addFeedback }) => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    addFeedback(data);
    reset();
  };

  return (
    <form className="feedback-form" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Ваше имя:</label>
        <input {...register('name')} />
      </div>
      <div>
        <label>Ваш отзыв:</label>
        <textarea {...register('feedback')} />
      </div>
      <button type="submit">Оставить отзыв</button>
    </form>
  );
};

export default FeedbackForm;