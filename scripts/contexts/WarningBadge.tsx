import React, { ReactNode } from 'react';


export const WarningBadge = ({ children }: { children: ReactNode; }) => {
  return (

    <div className='z-100 tx-altfont-5  bord-r-5 pa-1 w-200px'
      style={{ background: "#3d3d3d", boxShadow: "0 4px 20px #77553377" }}
    >
      <div className='tx-altfont-5 tx-md px-4 py-2  bord-r-5'
        style={{
          boxShadow: 'inset 1px 1px 3px 0 #aaaaaa, inset -3px -3px 5px 0 #111111',
          background: '#1d1d1d',
          color: "#aaaaaa",
        }}>
        {children}
      </div>
    </div>
  );
};
