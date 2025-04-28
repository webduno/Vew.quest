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


    <div className=' flex-col  pos-rel opaci-chov--75'
      onClick={onClick}
      style={{
      }}
    >
      <div className='w-80px h-80px bord-r-100'
      style={{
        transform: "scaleY(0.9) translateY(-10%)",
        background: mainColor,
        boxShadow: `0px 6px 0px 0px ${secondaryColor}`,
      }}
      ></div>
      <div className='nowrap z-100 bg-white border-gg bord-r-10 top-0 pos-abs translate-y--75 py-1 px-3 tx-bold'
        style={{
          color: mainColor,
        }}
      >{text}</div>
      <div
        style={{
          filter: "saturate(0) brightness(10)",
        }}
        className='pos-abs mb-3 tx-lgx'>{image}</div>
    </div>


  </>);
};
