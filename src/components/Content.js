import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useParams } from 'react-router-dom';

const labs = [
  { id: 1, title: 'Лабораторная работа 1', content: 'Содержимое лабораторной работы 1' },
  { id: 2, title: 'Лабораторная работа 2', content: 'Содержимое лабораторной работы 2' },
  { id: 3, title: 'Лабораторная работа 3', content: 'Содержимое лабораторной работы 3' },
  { id: 4, title: 'Лабораторная работа 4', content: 'Содержимое лабораторной работы 4' },
  { id: 5, title: 'Лабораторная работа 5', content: 'Содержимое лабораторной работы 5' },
  { id: 6, title: 'Лабораторная работа 6', content: 'Содержимое лабораторной работы 6' },
  { id: 7, title: 'Лабораторная работа 7', content: 'Содержимое лабораторной работы 7' },
  { id: 8, title: 'Лабораторная работа 8', content: 'Содержимое лабораторной работы 8' },
  { id: 9, title: 'Лабораторная работа 9', content: 'Содержимое лабораторной работы 9' },
];

const Content = () => {
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const lab = id ? labs.find(lab => lab.id === parseInt(id)) : null;

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={10} lg={8}>
        <Paper
          elevation={3}
          sx={{
            padding: isMobile ? '16px' : '24px',
            margin: isMobile ? '16px' : '24px',
            borderRadius: '12px',
            backgroundColor: 'background.paper'
          }}
        >
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            component="h2"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              marginBottom: '16px'
            }}
          >
            {lab ? lab.title : 'Выберите лабораторную работу'}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.6,
              fontSize: isMobile ? '0.9rem' : '1rem'
            }}
          >
            {lab ? lab.content : 'Содержимое лабораторной работы будет отображено здесь.'}
          </Typography>

          {!lab && (
            <Box sx={{ marginTop: '24px' }}>
              <Typography
                variant={isMobile ? 'body2' : 'body1'}
                color="text.secondary"
              >
                Для просмотра выберите лабораторную работу из меню
              </Typography>
            </Box>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Content;