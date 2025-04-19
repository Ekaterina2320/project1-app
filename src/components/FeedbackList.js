import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeedbacks, deleteFeedback } from '../redux/feedbackSlice';

const FeedbackList = () => {
  const dispatch = useDispatch();
  const { items: feedbacks, loading, error } = useSelector(state => state.feedbacks);
  const { currentUser } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchFeedbacks());
  }, [dispatch]);

  const activeFeedbacks = feedbacks.filter(fb => !fb.isBlocked);

  const handleDelete = async (id, userId) => {
    if (currentUser && (currentUser.id === userId || currentUser.isAdmin)) {
      if (window.confirm('Вы уверены, что хотите удалить этот отзыв?')) {
        await dispatch(deleteFeedback(id));
      }
    }
  };

  if (loading) return <div className="loading">Загрузка отзывов...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;

  return (
    <div className="feedback-list-container">
      <h2 className="feedback-list-title">История отзывов</h2>
      {feedbacks.length === 0 ? (
        <p className="no-feedbacks">Пока нет отзывов. Будьте первым!</p>
      ) : (
        <div className="feedback-list">
          {activeFeedbacks.map((feedback) => (
            <div key={feedback.id} className="feedback-item">
              <div className="feedback-header">
                <h3 className="feedback-author">{feedback.author}</h3>
                <span className="feedback-date">
                  {new Date(feedback.date).toLocaleString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <h4 className="feedback-title">{feedback.title}</h4>
              <p className="feedback-text">{feedback.message}</p>
              {currentUser && (currentUser.id === feedback.userId || currentUser.isAdmin) && (
                <button
                  className="feedback-delete-btn"
                  onClick={() => handleDelete(feedback.id, feedback.userId)}
                  aria-label="Удалить отзыв"
                >
                  Удалить
                </button>
              )}
              <div className="feedback-divider"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackList;