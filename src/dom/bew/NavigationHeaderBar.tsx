'use client';
import { BewWorldLogo } from '@/dom/bew/BewWorldLogo';
import { VersionTag } from './VersionTag';
import { usePathname } from 'next/navigation';

export const NavigationHeaderBar = ({
  linkList
}: {
  linkList?: any
}) => {
  const currentPath = usePathname();

  const isCurrentPage = (path: string) => {
    return currentPath === path;
  };

  return (
    <div className='flex-row w-100 w-max-1080px  tx-altfont-2'>
      <div className='py-8  w-100  '></div>

    <div className='pos-fix top-0 z-1000 flex-row w-100 w-max-1080px  tx-altfont-2'>
      <div className=''>
      <BewWorldLogo />
      </div>
<div className='flex-1 flex-row flex-justify-end  z-1000'>
  <details className='flex-col pos-rel ma-4'>
  <summary className='flex-col bg-white bord-r-10 pointer'
  style={{
    border: "1px solid #AFAFAF",
  }}
  >

  <button className='flex-col  px-2 py-2 px-4 noclick' style={{ color: "#AFAFAF" }}>
    <div className='noselect'>Menu</div>
  </button>
  </summary>

    <div className='pos-abs bottom-0 right-0 z-1000'
    style={{
      transform: "translate(-0%, 100%)",
    }}
    >
      
      <div className='flex-col pb-2 bg-glass-10  z-1000 mt-2 m r-4 bord-r-10 noverflow flex-align-end'
      style={{
        background: "#8080f0",
        boxShadow: "0 4px 0 #6060f0",
      }}
      >
      {!isCurrentPage('/tool') && (
        <a href="/tool" className='nodeco noselect py- py-1 px-4 block  opaci-chov--75  pt-2 z-1000' style={{ color: "#ffffff" }}>
          <div className="py-1 pl-2 nowrap"> Tool
             {/* <span className="tx-lgx py-" style={{ filter: 'saturate(0) brightness(2)' }}>👁️</span> */}
             </div>
        </a>
      )}
      {!isCurrentPage('/party') && (
        <a href="/party" className='nodeco noselect py- py-1 px-4 block  opaci-chov--75   z-1000' style={{ color: "#ffffff" }}>
          <div className="py-1 pl-2 nowrap">Party
             {/* <span className="tx-lgx py-" style={{ filter: 'saturate(0) brightness(100)' }}>🎉</span> */}
             </div>
        </a>
      )}
      {!isCurrentPage('/profile') && (
        <a href="/profile" className='nodeco noselect py- py-1 px-4 block  opaci-chov--75   z-1000' style={{ color: "#ffffff" }}>
          <div className="py-1 pl-2 nowrap">Profile
             {/* <span className="tx-lgx py-" style={{ filter: 'saturate(0) brightness(100)' }}>👤</span> */}
             </div>
        </a>
      )}
      {!isCurrentPage('/dashboard') && (
        <a href="/dashboard" className='nodeco noselect py- py-1 px-4 block  opaci-chov--75    z-1000' style={{ color: "#ffffff" }}>
          <div className="py-1 pl-2 nowrap">Dashboard
             {/* <span className="tx-lgx py-" style={{ filter: 'saturate(0) brightness(100)' }}>🧮</span> */}
             </div>
        </a>
      )}
      {/* {!isCurrentPage('/') && (
        <a href="/" className='nodeco noselect py- py-1 px-4 block  opaci-chov--75    z-1000' style={{ color: "#ffffff" }}>
          <div className="py-1 pl-2 nowrap">Home
          //  Page <span className="tx-lgx py-" style={{ filter: 'saturate(0) brightness(100)' }}>🏠</span>
           </div>
        </a>
      )}
       */}
       <div className="flex-row gap-2">
        {/* {!isCurrentPage('/leaderboard') && (
          <a href="/leaderboard" className='nodeco noselect py- py-1 px-1 block  opaci-chov--75    z-1000' style={{ color: "#ffffff" }}>
            <div className="py-1 pl-2 nowrap"> <span
            //  className="tx-lgx py-" style={{ filter: 'saturate(0) brightness(100)' }}>🏆</span>
             </div>
          </a>
        )} */}
        
        {!isCurrentPage('/about') && (
          <a href="/about" className='nodeco noselect py- py-1 pr-4 px-1 block  opaci-chov--75   z-1000' style={{ color: "#ffffff" }}>
            <div className="py-1 pl-2 nowrap">About <VersionTag />
               {/*  <span className="tx-lgx py-" style={{ filter: 'saturate(0) brightness(100)' }}>❓</span> */}
               </div>
          </a>
        )}
        </div>
      
      </div>
    </div>
  </details>
  
</div>
</div>
      {/* <div className='px-4 gap-3 flex-1 flex-row flex-justify-end tx-bold pt-4'>
{!linkList ? <>
        <a href="/dashboard" className='nodeco' style={{ color: "#AFAFAF" }}>
          <div className="py-1 pl-2 nowrap">Dashboard
          // 
          </div>
        </a>
        <a href="/about" className='nodeco' style={{ color: "#AFAFAF" }}>
          <div className="py-1 pl-2 nowrap">About
          //  <VersionTag />
           </div>
        </a>
        </> : linkList}
      </div> */}
    </div>
  );
};


