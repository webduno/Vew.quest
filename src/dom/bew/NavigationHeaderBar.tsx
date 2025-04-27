'use client';
import { BewWorldLogo } from '@/dom/bew/BewWorldLogo';
import { usePathname } from 'next/navigation';
import { MenuDropdownDetails } from './MenuDropdownDetails';

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
<MenuDropdownDetails isCurrentPage={isCurrentPage} />
  
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


