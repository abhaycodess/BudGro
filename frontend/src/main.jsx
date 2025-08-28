import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppWithRouter from './App.jsx';
import './form-global.css';
import { ExpenseUpdateProvider } from './context/ExpenseUpdateContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ExpenseUpdateProvider>
      <AppWithRouter />
    </ExpenseUpdateProvider>
  </StrictMode>,
);
