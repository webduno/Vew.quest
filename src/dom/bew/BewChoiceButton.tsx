'use client';
import React from 'react';

export const BewChoiceButton = ({
  onClick, text, image, mainColor, secondaryColor
}: {
  onClick: () => void;
  text: string;
  image: any;
  mainColor: string;
  secondaryColor: string;
}) => {
  return (<>


    <div className='w-80px h-80px flex-col bord-r-100 pos-rel opaci-chov--75'
      onClick={onClick}
      style={{
        background: mainColor,
        boxShadow: `0px 4px 0px 0px ${secondaryColor}`,
      }}
    >
      <div className='nowrap z-100 bg-white bord-r-10 top-0 pos-abs translate-y--75 py-1 px-3 tx-bold'
        style={{
          border: "1px solid #afafaf",

          color: mainColor,
        }}
      >{text}</div>
      <div
        style={{
          filter: "saturate(0) brightness(10)",
        }}
        className='pos-abs tx-lgx'>{image}</div>
    </div>


  </>);
};
