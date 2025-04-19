'use client';
import React, { useState, useEffect } from 'react';

type InputType = 'object' | 'entity' | 'place' | 'event';

type OptionsValues = {
  type: InputType;
  natural: number;
  temp: number;
  light: number;
  color: number;
  solid: number;
};

export const MultiOptionInputs = ({ 
  onValuesChange,
  initialValues = {
    type: 'object' as InputType,
    natural: 0,
    temp: 0,
    light: 0,
    color: 0,
    solid: 0
  }
}: { 
  onValuesChange: (values: OptionsValues) => void;
  initialValues?: OptionsValues;
}) => {
  const [values, setValues] = useState<OptionsValues>(initialValues);

  // Update values when initialValues change
  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const handleChange = (key: keyof OptionsValues, value: number | InputType) => {
    const newValues = { ...values, [key]: value };
    setValues(newValues);
    onValuesChange(newValues);
  };

  return (<>
    <div className='flex-col flex-align-stretch gap-  2 tx-altfont-1'>
      <div className='pa-2 bord-r-10'>
        <div className="tx-bold mb-2" style={{color:"#afafaf"}}>Type</div>
        <div className='flex-row flex-wrap gap-3'>
          {(['object', 'entity', 'place', 'event'] as InputType[]).map((type) => (
            <div 
              key={type}
              className='flex-row gap-1 flex-align-around opaci-chov--75 pointer'
              onClick={() => handleChange('type', type)}
            >
              <div className='w-15px h-15px bord-r-3'
                style={{
                  border: '2px solid #afafaf',
                  background: values.type === type ? '#afafaf' : 'transparent'
                }}
              />
              <div style={{color: values.type === type ? '#2B29AF' : '#afafaf', fontWeight: values.type === type ? 'bold' : 'normal'}}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='pa-2 bord-r-10'>
        <div className="tx-bold" style={{color:"#afafaf"}}>Natural</div>
        <div className='w-100'>
          <input className='w-100' type="range" 
            value={values.natural}
            onChange={(e) => handleChange('natural', parseInt(e.target.value))}
          />
        </div>
      </div>
      <div className='pa-2 bord-r-10'>
        <div className="tx-bold" style={{color:"#afafaf"}}>Temperature</div>
        <div className='w-100'>
          <input className='w-100' type="range" 
            value={values.temp}
            onChange={(e) => handleChange('temp', parseInt(e.target.value))}
          />
        </div>
      </div>
      <div className='pa-2 bord-r-10'>
        <div className="tx-bold" style={{color:"#afafaf"}}>Light</div>
        <div className='w-100'>
          <input className='w-100' type="range" 
            value={values.light}
            onChange={(e) => handleChange('light', parseInt(e.target.value))}
          />
        </div>
      </div>
      <div className='pa-2 bord-r-10'>
        <div className="tx-bold" style={{color:"#afafaf"}}>Color</div>
        <div className='w-100'>
          <input className='w-100' type="range" 
            value={values.color}
            onChange={(e) => handleChange('color', parseInt(e.target.value))}
          />
        </div>
      </div>
      <div className='pa-2 bord-r-10'>
        <div className="tx-bold" style={{color:"#afafaf"}}>Solid</div>
        <div className='w-100'>
          <input className='w-100' type="range" 
            value={values.solid}
            onChange={(e) => handleChange('solid', parseInt(e.target.value))}
          />
        </div>
      </div>
    </div>
  </>);
};
