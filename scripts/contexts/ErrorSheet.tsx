import React, { ReactNode } from 'react';


export const ErrorSheet = ({ children }: { children: ReactNode; }) => {
  return (

    <div className='px-2 pt-2 pb-1 z-100 tx-altfont-8   tx-lgx w-150px'
      style={{
        transform: "rotate(1deg)",
        clipPath: "polygon(50% 0%, 100% 2%, 98% 60%, 100% 97%, 4% 100%, 0% 60%, 2% 3%)",
        background: "linear-gradient(0deg, #776C61, #8F8B7D, #805C51)",
      }}
    >
      {children}
    </div>
  );
};
