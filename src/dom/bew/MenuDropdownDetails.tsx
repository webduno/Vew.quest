'use client';
import { VersionTag } from './VersionTag';



export const MenuDropdownDetails = ({ isCurrentPage }: { isCurrentPage: any; }) => {
  return (

    <details className='flex-col pos-rel ma-4'>
      <summary className='flex-col bg-white bord-r-10 pointer'
        style={{
          border: "1px solid #AFAFAF",
        }}
      >

        <button className='flex-col  px-2 py-2 px-4 noclick' style={{ color: "#AFAFAF" }}>
          <div className='noselect'>Menu</div>
        </button>
      </summary>

      <div className='pos-abs gap-2 flex-align-end flex-col-r bottom-0 right-0 z-1000'
        style={{
          transform: "translate(-0%, 100%)",
        }}
      >

<details className='flex-col  r tx-white bord-r-10  '
style={{
  background: "#8080f0",
  boxShadow: "0 4px 0 #6060f0",
}}>
  <summary className='flex flex-col b opaci-chov--50'
  >
    <button className='noclick tx-end g nowrap w-150px tx-white py-3 pr-3 block'>
      More Options
    </button>
  </summary>

        {(
          <div className='flex-col flex-justify-end pb-2 bg-glass-10 tx-sm z-1000   noverflow flex-align-end tx-white'
            
  style={{
    borderTop: "1px solid #aaaaff",
  }}
          >
            {!isCurrentPage('/space') && (
              <a href="/space" className='nodeco noselect py- py-1 px-4 block  opaci-chov--75  pt-2 z-1000' style={{ color: "#ffffff" }}>
                <div className="py-1 pl-2 nowrap">Space RV</div>
              </a>
            )}

            {!isCurrentPage('/world') && (
              <a href="/world" className='nodeco noselect py- py-1 px-4 block  opaci-chov--75  pt-2 z-1000' style={{ color: "#ffffff" }}>
                <div className="py-1 pl-2 nowrap"> 3D Worlds</div>
              </a>
            )}

            {!isCurrentPage('/leaderboard') && (
              <a href="/leaderboard" className='nodeco noselect py- py-1 px-4 block  opaci-chov--75  pt-2 z-1000' style={{ color: "#ffffff" }}>
                <div className="py-1 pl-2 nowrap"> Leaderboard</div>
              </a>
            )}
            {!isCurrentPage('/about') && (
              <a href="/about" className='nodeco noselect py- py-1 pr-4 px-1 block  opaci-chov--75   z-1000' style={{ color: "#ffffff" }}>
                <div className="py-1 pl-2 nowrap">About <VersionTag />
                  {/*  <span className="tx-lgx py-" style={{ filter: 'saturate(0) brightness(100)' }}>❓</span> */}
                </div>
              </a>
            )}

          </div>
        )}
</details>

        <div className='flex-col pb-2 bg-glass-10  z-1000 mt-2 m r-4 bord-r-10 noverflow flex-align-end'
          style={{
            background: "#8080f0",
            boxShadow: "0 4px 0 #6060f0",
          }}
        >
          {!isCurrentPage('/profile') && (
            <a href="/profile" className='nodeco noselect py- py-1 px-4 block  opaci-chov--75   z-1000' style={{ color: "#ffffff" }}>
              <div className="py-1 pl-2 nowrap">Profile
              </div>
            </a>
          )}
          <a href="/tool" className='nodeco noselect py- py-1 px-4 block  opaci-chov--75  pt-2 z-1000' style={{ color: "#ffffff" }}>
            <div className="py-1 pl-2 nowrap">RV Tool
              {/* <span className="tx-lgx py-" style={{ filter: 'saturate(0) brightness(2)' }}>👁️</span> */}
            </div>
          </a>
          {!isCurrentPage('/party') && (
            <a href="/party" className='nodeco noselect py- py-1 px-4 block  opaci-chov--75   z-1000' style={{ color: "#ffffff" }}>
              <div className="py-1 pl-2 nowrap">CRV Party
              </div>
            </a>
          )}
          {!isCurrentPage('/dashboard') && (
            <a href="/dashboard" className='nodeco noselect py- py-1 px-4 block  opaci-chov--75    z-1000' style={{ color: "#ffffff" }}>
              <div className="py-1 pl-2 nowrap">Dashboard
                {/* <span className="tx-lgx py-" style={{ filter: 'saturate(0) brightness(100)' }}>🧮</span> */}
              </div>
            </a>
          )}
          {/* {!isCurrentPage('/') && (
              <a href="/" className='nodeco noselect py- py-1 px-4 block  opaci-chov--75    z-1000' style={{ color: "#ffffff" }}>
                <div className="py-1 pl-2 nowrap">Home
                //  Page <span className="tx-lgx py-" style={{ filter: 'saturate(0) brightness(100)' }}>🏠</span>
                 </div>
              </a>
            )}
             */}
          <div className="flex-row gap-2">
            {/* {!isCurrentPage('/leaderboard') && (
              <a href="/leaderboard" className='nodeco noselect py- py-1 px-1 block  opaci-chov--75    z-1000' style={{ color: "#ffffff" }}>
                <div className="py-1 pl-2 nowrap"> <span
                //  className="tx-lgx py-" style={{ filter: 'saturate(0) brightness(100)' }}>🏆</span>
                 </div>
              </a>
            )} */}

          </div>

        </div>
      </div>
    </details>
  );
};
