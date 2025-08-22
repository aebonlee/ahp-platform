import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders AHP for Paper title', () => {
  render(<App />);
  const titleElement = screen.getByText(/AHP for Paper/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders system description', () => {
  render(<App />);
  const descriptionElement = screen.getByText(/연구 논문을 위한 AHP 의사결정 분석 시스템/i);
  expect(descriptionElement).toBeInTheDocument();
});
