import { GameButton } from '@/dom/atom/game/GameButton';

export const BewMobileOverlay = () => {
  return (
    <>
    
      {/* Movement joystick */}
      <div id="joystick-container"
        className='pos-abs bottom-0 left-0  bg-b-50 bord-r-100 ma-4'
        style={{
          width: '120px',
          height: '120px',
          touchAction: 'none',
          zIndex: 1000
        }} />

      {/* Jump button */}
      <button
        className='pos-abs bottom-0 right-0 tx-altfont-1 tx-lgx  py-2 bord-r-5 ma-4 '
        id="jump-button" style={{
          zIndex: 1000,
          
        }}>
        JUMP
      </button>

      {/* Look area - for camera rotation */}
      <div id="look-area" style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '50%',
        height: '100%',
        touchAction: 'none',
        zIndex: 999
      }} />
    </>
  );
}; 