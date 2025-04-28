'use client';
import React, { useState, useEffect } from 'react';

export const NotesInputs = ({ 
  onValueChange,
  initialValue = ''
}: { 
  onValueChange: (value: string) => void;
  initialValue?: string;
}) => {
  const [value, setValue] = useState(initialValue);

  // Update value when initialValue changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onValueChange(newValue);
  };

  return (<>
    <div className='flex-col flex-align-stretch tx-altfont-2'>
      <textarea className='flex-1 bord-r-15 pa-4 border-gg' 
        rows={12}
        value={value}
        onChange={handleChange}
      />
    </div>
  </>);
};
