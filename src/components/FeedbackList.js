import React from 'react';

const FeedbackList = ({ feedbacks }) => {
  return (
    <div className="feedback-list">
      {feedbacks.map((feedback, index) => (
        <div key={index}>
          <h3>{feedback.name}</h3>
          <p>{feedback.feedback}</p>
        </div>
      ))}
    </div>
  );
};

export default FeedbackList;