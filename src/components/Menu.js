import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

const labs = [
  { id: 1, title: 'Лабораторная работа 1', content: 'Содержимое лабораторной работы 1' },
  { id: 2, title: 'Лабораторная работа 2', content: 'Содержимое лабораторной работы 2' },
  { id: 3, title: 'Лабораторная работа 3', content: 'Содержимое лабораторной работы 3' },
];

const Menu = ({ onLabSelect }) => {
  return (
    <List>
      {labs.map((lab) => (
        <ListItem button key={lab.id} onClick={() => onLabSelect(lab)}>
          <ListItemText primary={lab.title} />
        </ListItem>
      ))}
    </List>
  );
};

export default Menu;