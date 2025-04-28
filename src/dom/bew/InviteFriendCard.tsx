'use client';
import React from 'react';
import { Tooltip } from 'react-tooltip';





export const InviteFriendCard = () => {
  return (<>




<Tooltip id="invite-friend-card-tooltip" />
    <a className='bord-r-15 py-3 px-4 opaci-chov--75 Q_xs_py-1 border-gg nodeco'
    data-tooltip-id="invite-friend-card-tooltip"
    data-tooltip-content="Coordinated Remote Viewing"
    data-tooltip-place="top"
    href="/party"
    // data-tooltip-variant='light'
    >
      <div className='flex-row flex-justify-start gap-2 '>
        <div>
          {/* party popper emoji  */}
          <div className='tx-lgx pb-2'>🎉</div>
        </div>
        <div className='flex-col flex-align-start gap-2'>
          <div className='tx-bold'
            onClick={() => {
            }}
            style={{
              color: "#4B4B4B",
            }}
          >Join Party Room (CRV)</div>

          <div className='tx-sm Q_sm_x' style={{ color: "#afafaf" }}>
            <div className='flex-col flex-align-start gap-1'>
              <div>Invite friend and start a new</div>
              <div>Coordinated Remote Viewing</div>
            </div>
          </div>
        </div>
      </div>

      <div>



      </div>
    </a>
    </>);
};
