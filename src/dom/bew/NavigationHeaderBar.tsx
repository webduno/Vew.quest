'use client';
import { BewWorldLogo } from '@/dom/bew/BewWorldLogo';
import { VersionTag } from './VersionTag';


export const NavigationHeaderBar = ({
  linkList
}: {
  linkList?: any
}) => {
  return (
    <div className='flex-row w-100 w-max-1080px  tx-altfont-2'>
      <BewWorldLogo />

      <div className='px-4 gap-3 flex-1 flex-row flex-justify-end tx-bold pt-4'>
{!linkList ? <>
        <a href="/dashboard" className='nodeco' style={{ color: "#AFAFAF" }}>
          <div>Dashboard</div>
        </a>
        <a href="/about" className='nodeco' style={{ color: "#AFAFAF" }}>
          <div>About <VersionTag /></div>
        </a>
        </> : linkList}
      </div>
    </div>
  );
};


