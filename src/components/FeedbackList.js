import React from 'react';

const FeedbackList = ({ feedbacks }) => {
  return (
    <div className="feedback-list-container">
      <h2 className="feedback-list-title">История отзывов</h2>
      {feedbacks.length === 0 ? (
        <p className="no-feedbacks">Пока нет отзывов</p>
      ) : (
        <div className="feedback-list">
          {feedbacks.map((feedback, index) => (
            <div key={index} className="feedback-item">
              <h3 className="feedback-author">{feedback.name}</h3>
              <p className="feedback-text">{feedback.feedback}</p>
              <div className="feedback-divider"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackList;