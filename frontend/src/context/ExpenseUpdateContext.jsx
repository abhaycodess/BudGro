import React, { useState } from 'react';
import { ExpenseUpdateContext } from './ExpenseUpdateContextContext.js';



export function ExpenseUpdateProvider({ children }) {
  const [updateFlag, setUpdateFlag] = useState(0);
  const triggerUpdate = () => setUpdateFlag(f => f + 1);
  return (
    <ExpenseUpdateContext.Provider value={{ updateFlag, triggerUpdate }}>
      {children}
    </ExpenseUpdateContext.Provider>
  );
}


