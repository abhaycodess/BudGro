import React, { createContext, useContext, useState } from 'react';

const ExpenseUpdateContext = createContext();

export function ExpenseUpdateProvider({ children }) {
  const [updateFlag, setUpdateFlag] = useState(0);
  const triggerUpdate = () => setUpdateFlag(f => f + 1);
  return (
    <ExpenseUpdateContext.Provider value={{ updateFlag, triggerUpdate }}>
      {children}
    </ExpenseUpdateContext.Provider>
  );
}

export function useExpenseUpdate() {
  return useContext(ExpenseUpdateContext);
}
