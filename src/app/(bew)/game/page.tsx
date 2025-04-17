import { BewGameContainer } from '@/model/bew/BewGameContainer';
import { BewLogo } from '@/dom/atom/logo/BewLogo';

export default function NewGamePage() {
  return (
    <div className='w-100 h-100 '>
      <div className='pos-abs top-0 left-0 '
      style={{
        zIndex: 5000,
      }}
      >
        <BewLogo />
      </div>
      <BewGameContainer />
    </div>
  );
} 


