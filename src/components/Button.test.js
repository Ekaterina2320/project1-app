import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  // Тест на корректное отображение текста кнопки
  it('renders the button with the correct text', () => {
    const buttonText = 'Click Me';
    render(<Button text={buttonText} onClick={() => {}} />);

    const buttonElement = screen.getByText(buttonText);
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent(buttonText);
  });

  // Тест на вызов обработчика onClick при клике
  it('calls the onClick handler when clicked', () => {
    const handleClick = jest.fn(); // Мок-функция для отслеживания вызовов
    const buttonText = 'Click Me';

    render(<Button text={buttonText} onClick={handleClick} />);

    const buttonElement = screen.getByText(buttonText);
    fireEvent.click(buttonElement); // Имитация клика

    expect(handleClick).toHaveBeenCalledTimes(1); // Проверка, что обработчик вызван 1 раз
  });

  // Опционально: тест на стилизацию кнопки
  it('has the correct styles applied', () => {
    const buttonText = 'Click Me';
    render(<Button text={buttonText} onClick={() => {}} />);

    const buttonElement = screen.getByText(buttonText);

    // Проверка основных стилей
    expect(buttonElement).toHaveStyle({
      padding: '10px 20px',
      backgroundColor: 'rgb(0, 123, 255)',
      color: 'white',
      border: '2px outset buttonface',
      borderRadius: '5px',
      cursor: 'pointer',
    });
  });
});