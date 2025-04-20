import React, { useState } from 'react';
import { Box, Typography, Button, Modal } from '@mui/material';
import FeedbackForm from './FeedbackForm';
import FeedbackList from './FeedbackList';

const Footer = () => {
  // Состояния для управления видимостью модальных окон
  const [feedbackFormOpen, setFeedbackFormOpen] = useState(false);
  const [feedbackListOpen, setFeedbackListOpen] = useState(false);
  // Обработчики открытия/закрытия модального окна формы отзыва
  const handleFeedbackFormOpen = () => setFeedbackFormOpen(true);
  const handleFeedbackFormClose = () => setFeedbackFormOpen(false);
  // Обработчики открытия/закрытия модального окна списка отзывов
  const handleFeedbackListOpen = () => setFeedbackListOpen(true);
  const handleFeedbackListClose = () => setFeedbackListOpen(false);

  return (
    <Box
      sx={{
        backgroundColor: '#333',
        color: 'white',
        textAlign: 'center',
        padding: '10px',
        marginTop: 'auto',
      }}
    >
      <Button onClick={handleFeedbackFormOpen} variant="contained" color="primary">
        Оставить отзыв
      </Button>
      <Button onClick={handleFeedbackListOpen} variant="contained" color="primary"> {/* Changed color to primary */}
        История отзывов
      </Button>

      {/* Modal для формы обратной связи */}
      <Modal
        open={feedbackFormOpen} // Управление видимостью
        onClose={handleFeedbackFormClose} // Обработчик закрытия
        aria-labelledby="feedback-form-modal-title"
        aria-describedby="feedback-form-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="feedback-form-modal-title" variant="h6" component="h2">
            Оставить отзыв
          </Typography>
          <FeedbackForm />
          <Button onClick={handleFeedbackFormClose}>Закрыть</Button>
        </Box>
      </Modal>

      {/* Modal для истории отзывов */}
      <Modal
        open={feedbackListOpen}
        onClose={handleFeedbackListClose}
        aria-labelledby="feedback-list-modal-title"
        aria-describedby="feedback-list-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,  // Adjust width as needed
          maxHeight: '80vh', // Add max height
          overflowY: 'auto', // Add scroll if content overflows
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="feedback-list-modal-title" variant="h6" component="h2">
            История отзывов
          </Typography>
          <FeedbackList />
          <Button onClick={handleFeedbackListClose}>Закрыть</Button>
        </Box>
      </Modal>

      <Typography variant="body1">
        © 2025 Лабораторные работы. Чудесные лабораторные работы.
      </Typography>
    </Box>
  );
};

export default Footer;