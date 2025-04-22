'use client';
import { UserStats } from '@/script/utils/calculations';

interface GuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  guestUsername: string;
  guestStats: {
    crvObjects: any[];
    streak: number;
    potentialStreak: number;
    averageResult: number;
    isLoading: boolean;
    error: string | null;
  };
}

export function GuestModal({ isOpen, onClose, guestUsername, guestStats }: GuestModalProps) {
  if (!isOpen) return null;

  return (
    <div className='pos-abs flex-col top-0 left-0 w-100 h-100 bg-glass-10 z-200'>
      <div className='flex-col px-8 flex-align-center tx-altfont-2 gap-2 bg-white box-shadow-2-b bord-r-15 pa-4'>
        <div className='flex-col w-100'>
          <div onClick={onClose}
            className='opaci-chov--75 tx-bold tx-lg pb-2'>
            <div className='opaci-25 underline'>Close</div>
          </div>
        </div>
        <div className='bord-r-15 flex-col'
          style={{
            width: '90vw',
            maxWidth: '800px',
            minHeight: '300px'
          }}
        >
          {guestStats.isLoading ? (
            <div className='flex-col flex-align-center flex-justify-center h-100'>
              <div className='tx-ls-3'>Loading...</div>
            </div>
          ) : guestStats.error ? (
            <div className='flex-col flex-align-center flex-justify-center h-100'>
              <div className='tx-ls-3'>{guestStats.error}</div>
            </div>
          ) : (
            <div className='flex-col gap-4'>
              <div className='tx-bold tx-lg'>Guest Stats: {guestUsername}</div>
              <div className='flex-row gap-4 flex-wrap'>
                <div className='bord-r-15 pb-2 pt-4 px-4' style={{ border: "1px solid #f0f0f0" }}>
                  <div className='tx-bold tx-lg mb-2'>RV Stats</div>
                  <div className='flex-col gap-2 flex-align-start'>
                    <div>Streak Potential: {guestStats.streak || guestStats.potentialStreak}</div>
                    <div>Total Requests: {guestStats.crvObjects.length}</div>
                    <div>First Request: {guestStats.crvObjects.length > 0 ? new Date(guestStats.crvObjects[guestStats.crvObjects.length - 1].created_at).toLocaleDateString() : 'No requests yet'}</div>
                    <div>Average Accuracy: {guestStats.averageResult.toFixed(3)}%</div>
                    <div>Personal Record: {guestStats.crvObjects.length > 0 ? Math.max(...guestStats.crvObjects.map((obj: any) => obj.result)).toFixed(3) : 0}%</div>
                  </div>
                </div>
                <div className='bord-r-15 pt-4 pb-2 px-4' style={{ border: "1px solid #f0f0f0" }}>
                  <div className='tx-bold tx-lg mb-2'>Daily Goals</div>
                  <div className='flex-col gap-2 flex-align-start'>
                    <div>Current Streak: {guestStats.streak}</div>
                    <div>Viewed Today: {guestStats.crvObjects.filter((obj: any) => obj.created_at.split('T')[0] === new Date().toISOString().split('T')[0]).length}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 