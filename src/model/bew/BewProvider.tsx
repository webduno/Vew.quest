import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the context type (currently empty)
type BewContextType = {
  testdata: string;
};

// Create the context with default values
const BewContext = createContext<BewContextType | undefined>(undefined);

// Provider component
export const BewProvider = ({ children }: { children: ReactNode }) => {
  // Add state and functions for the context here later
  const contextValue: BewContextType = {
    // Provide context values here
    testdata: "testdata"
  };

  console.log('BewProvider: contextValue is', contextValue);

  return (
    <BewContext.Provider value={contextValue}>
      {children}
    </BewContext.Provider>
  );
};