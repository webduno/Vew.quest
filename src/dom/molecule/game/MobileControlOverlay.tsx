
export const MobileControlOverlay = () => {
  return (
    <>
    
      {/* Movement joystick */}
      <div id="joystick-container"
        className='pos-abs bottom-0 flex-col left-0   bord-r-100 ma-4'
        style={{
          background: 'radial-gradient(#444444, #000000)',
          boxShadow: '0 0 2px 3px #66665A, 2px 2px 0 5px #2F2E29, -1px -1px 0 4px #7F7E79',
          width: '100px',
          height: '100px',
          touchAction: 'none',
          color:"#aFaEa9",
          zIndex: 1000
        }}>
          <div className=' tx-altfont-5 tx-md'>MOVE</div>
        </div>

      {/* Jump button */}
      <button
        className='pos-abs bottom-0 flex-col  tx-lgx  noborder pa-0 ma-0 bord-r-5 ma-4 '
        id="jump-button" style={{
          zIndex: 1000,
        }}>
        
      <div  
      className={"key-btn noborder px-2 py-1 bord-r-5 noverflow tx-lg tx-altfont-1  noclick"}
      style={{
        color:"#aFaEa9",
      }}
      >
      JUMP
    </div>
      </button>

      {/* Look area - for camera rotation */}
      <div id="look-area" className='pos-abs bottom-0 flex-col right-0 bord-r-100 bg-b-50 ma-4' style={{
        position: 'absolute',
        background: 'radial-gradient(#444444, #000000)',
        boxShadow: '0 0 2px 3px #66665A, 2px 2px 0 5px #2F2E29, -1px -1px 0 4px #7F7E79',
        width: '100px',
        height: '100px',
        touchAction: 'none',
        color:"#aFaEa9",
        zIndex: 999
      }} >
        <div className=' tx-altfont-5 tx-md'>LOOK</div>
      </div>
    </>
  );
}; 