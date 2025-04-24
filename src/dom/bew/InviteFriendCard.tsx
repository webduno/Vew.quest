'use client';
import React from 'react';





export const InviteFriendCard = () => {
  return (





    <button className='bord-r-15 py-3 px-4 opaci-chov--75 Q_xs_py-1'
      onClick={() => {

        const guestid = prompt("Enter friend ID");
        if (!guestid) {
          alert("Please enter a friend ID");
          return;
        }



        window.location.href = "/party/" + guestid;
      }}
      style={{
        border: "1px solid #E5E5E5",
      }}
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
          >Join Party Room</div>

          <div className='tx-sm Q_sm_x' style={{ color: "#afafaf" }}>
            <div className='flex-col flex-align-start gap-1'>
              <div>Invite friend for</div>
              <div>Coordinated Remote Viewing</div>
            </div>
          </div>
        </div>
      </div>

      <div>



      </div>
    </button>
  );
};
