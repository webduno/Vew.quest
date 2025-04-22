'use client';
import React from 'react';





export const InviteFriendCard = () => {
  return (





    <button className='bord-r-15 py-1 px-4 opaci-chov--75'
      onClick={() => {

        const guestid = prompt("Enter friend ID");
        if (!guestid) {
          alert("Please enter a friend ID");
          return;
        }



        window.location.href = "/tool?friend=" + guestid;
      }}
      style={{
        border: "1px solid #E5E5E5",
      }}
    >
      <div className='flex-row flex-justify-start gap-2'>
        <div>
          {/* group of people emoji  */}
          <div className='tx-lgx pb-2'>👥</div>
        </div>
        <div className='flex-col flex-align-start gap-2'>
          <div className='tx-bold'
            onClick={() => {
            }}
            style={{
              color: "#4B4B4B",
            }}
          >Invite friends (CRV)</div>

          <div className='tx-sm Q_sm_x' style={{ color: "#afafaf" }}>
            <div className='flex-row gap-1'>
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
