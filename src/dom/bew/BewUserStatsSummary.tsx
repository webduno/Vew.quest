'use client';



export const BewUserStatsSummary = () => {
  return (<>


    <div className='flex-row flex-justify-between tx-altfont-2'>
      <div className='tx- lg pa-2 pt-4  opaci-chov--50 flex-wrap'
        data-tooltip-id="streak-tooltip"
        data-tooltip-content="Streak"
        data-tooltip-place="bottom"
      >
        {/* fire emoji */}
        <div className='tx-lg tx-center'>🔥</div>
        <div className='tx-bold-5' style={{ color: "#FFB02E" }}>169</div>
      </div>
      <div className='tx- lg pa-2 pt-4  opaci-chov--50 flex-wrap'
        data-tooltip-id="points-tooltip"
        data-tooltip-content="Fuel"
        data-tooltip-place="bottom"
      >
        {/* diamond emoji */}
        <div className='tx-lg tx-center'>💎</div>
        <div className='tx-bold-5' style={{ color: "#00A6ED" }}>1224</div>
      </div>
      <div className='tx- lg pa-2 pt-4  opaci-chov--50 flex-wrap'
        data-tooltip-id="hearts-tooltip"
        data-tooltip-content="Friends"
        data-tooltip-place="bottom"
      >
        {/* heart emoji */}
        <div className='tx-lg tx-center'>💖</div>
        <div className='tx-bold-5' style={{ color: "#F92F60" }}>5</div>
      </div>
    </div>


  </>);
};
