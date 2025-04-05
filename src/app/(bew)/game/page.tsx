import { BewGame } from '@/model/bew/BewGame';
import { BewLogo } from '@/model/bew/BewLogo';

export default function NewGamePage() {
  return (
    <div className='w-100 h-100 '>
      <div className='pos-abs top-0 left-0 '>
        <BewLogo />
      </div>
      <BewGame />
    </div>
  );
} 


