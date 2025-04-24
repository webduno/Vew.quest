'use client';
import { useState, useEffect } from 'react';
import { isMobile } from '../../../../script/utils/platform/mobileDetection';


export const VewLandingGraphic = () => {
return(<>
<div className='flex-col '>
            <div className='Q_xs_sm py-4'></div>

            <img src="/bew/cleaneyes.png" alt="tool_bg3"
            className={'pointer hover-jump pos-abs noselect noverflow block  Q_xs_pt-8 '+ (isMobile() ? 'w-100px' : 'w-150px')} 
            />

            <img src="/bew/starsbg2.jpeg" alt="tool_bg4"
              className={'pointer bord-r-50 noverflow noselect block '+(isMobile() ? 'w-150px' : 'w-250px')} 
            />

          </div>
</>)
};
