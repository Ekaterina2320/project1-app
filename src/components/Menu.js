import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

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

const Menu = ({ onClose }) => {
  return (
    <List>
      {labs.map((lab) => (
        <ListItem
          button
          key={lab.id}
          component={Link}
          to={`/lab/${lab.id}`}
          onClick={onClose}
        >
          <ListItemText primary={lab.title} />
        </ListItem>
      ))}
    </List>
  );
};

export default Menu;