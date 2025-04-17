import React, { ReactNode } from 'react';



export const HandbookPage = ({ children }: { children: ReactNode; }) => {
  return (

    <div className='px-2 py-3 z-100 tx-altfont-1   tx-smd w-100px'
      style={{
        transform: "rotate(1deg)",
        boxShadow: "2px 2px 10px #444444, 3px 3px 0 0 #bFb7aD",
        background: "linear-gradient(45deg, #dcd7c1, #bFb7aD)",
      }}
    >
      <div className='tx-altfont-5 pb-2 underline pl-2 tx-xs'>HINT</div>
      {children}
    </div>
  );
};
