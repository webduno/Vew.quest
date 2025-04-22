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
  onValueChange,
  initialValues = {
    type: 'object' as InputType,
    natural: 0,
    temp: 0,
    light: 0,
    color: 0,
    solid: 0
  }
}: { 
  onValueChange: (values: OptionsValues) => void;
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
    onValueChange(newValues);
  };

  return (<>
    <div className='flex-col flex-align-stretch gap-  2 tx-altfont-2'
    style={{
      filter: "hue-rotate(180deg)"
    }}
    >
      <div className='pa-2 Q_xs_py-1 bord-r-10 tx-'>
        <div className="tx-bold mb-2" style={{color:"#afafaf"}}>Target Type</div>
        <div className='flex-row flex-wrap gap-3'>
          {(['object', 'entity', 'place', 'event'] as InputType[]).map((type) => (
            <div 
              key={type}
              className='flex-row gap-1 flex-align-around opaci-chov--75 pointer'
              onClick={() => handleChange('type', type)}
            >
              <div className='' 
              style={{
                borderBottom: '2px solid '+(values.type === type ? '#0079D0' : '#afafaf'),
                color: values.type === type ? '#0079D0' : '#afafaf', 
                fontWeight: values.type === type ? 'bold' : 'normal'}}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='pa-2 Q_xs_py-1 bord-r-10 tx-xs'>
        <div className=" flex-row flex-justify-between" style={{color:"#afafaf"}}>
          <div>Natural or Organic</div>
          <div>Artificial or Synthetic</div>
        </div>
        <div className='w-100'>
          <input className='w-100' type="range" 
            value={values.natural}
            onChange={(e) => handleChange('natural', parseInt(e.target.value))}
          />
        </div>
      </div>
      <div className='pa-2 Q_xs_py-1 bord-r-10 tx-xs'>
        <div className=" flex-row flex-justify-between" style={{color:"#afafaf"}}>
          <div>Hot or Warm</div>
          <div>Cold or Chilly</div>
        </div>
        <div className='w-100'>
          <input className='w-100' type="range" 
            value={values.temp}
            onChange={(e) => handleChange('temp', parseInt(e.target.value))}
          />
        </div>
      </div>
      <div className='pa-2 Q_xs_py-1 bord-r-10 tx-xs'>
        <div className=" flex-row flex-justify-between" style={{color:"#afafaf"}}>
          <div>Dark or Dim</div>
          <div>Light or Bright</div>
        </div>
        <div className='w-100'>
          <input className='w-100' type="range" 
            value={values.light}
            onChange={(e) => handleChange('light', parseInt(e.target.value))}
          />
        </div>
      </div>
      <div className='pa-2 Q_xs_py-1 bord-r-10 tx-xs'>
        <div className=" flex-row flex-justify-between" style={{color:"#afafaf"}}>
          <div>Monochrome or Gray</div>
          <div>Colorful or Vivid</div>
        </div>
        <div className='w-100'>
          <input className='w-100' type="range" 
            value={values.color}
            onChange={(e) => handleChange('color', parseInt(e.target.value))}
          />
        </div>
      </div>
      <div className='pa-2 Q_xs_py-1 bord-r-10 tx-xs'>
        <div className=" flex-row flex-justify-between" style={{color:"#afafaf"}}>
          <div>Ethereal or Wispy</div>
          <div>Solid or Dense</div>
        </div>
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
