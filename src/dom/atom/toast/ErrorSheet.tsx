import React, { ReactNode } from 'react';


export const ErrorSheet = ({ children }: { children: ReactNode; }) => {
  return (
<div className='w-150px'>
    <div className='px-2 pt-2 pb-1 z-100 tx-altfont-8   tx-lgx '
      style={{
        transform: "rotate(1deg)",
        clipPath: "polygon(50% 0%, 99% 0, 100% 60%, 97% 98%, 0 100%, 3% 53%, 0 0)",
        background: "linear-gradient(0deg, #776C61, #8F8B7D, #805C51)",
      }}
    >
      {children}
    </div>
    </div>
  );
};
