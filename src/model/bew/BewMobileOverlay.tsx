import { GameButton } from '@/dom/atom/game/GameButton';

export const BewMobileOverlay = () => {
  return (
    <>
    
      {/* Movement joystick */}
      <div id="joystick-container"
        className='pos-abs bottom-0 left-25p 8 bg-b-50 bord-r-100'
        style={{
          marginBottom: "55px",
          width: '120px',
          height: '120px',
          touchAction: 'none',
          zIndex: 1000
        }} />

      {/* Jump button */}
      <GameButton buttonType="zeta"
        classOverride='pos-abs bottom-0 right-0  tx-lgx bord-r-100 py-5 mr-4'
        id="jump-button" styleOverride={{
          marginBottom: "60px",
          touchAction: 'none',
          zIndex: 1000
        }}>
        JUMP
      </GameButton>

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