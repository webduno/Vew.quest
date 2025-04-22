import { Tooltip } from "react-tooltip";

export const LandingProfileActionButton = ({typedUsername, handleStart}: {typedUsername: string, handleStart: () => void}) => {
    return (<>
      <Tooltip id="profile-tooltip" />
              <a href="/profile"
              data-tooltip-id="profile-tooltip"
  
              data-tooltip-place="bottom"
              data-tooltip-content={typedUsername + "'s Profile"}
                className='py-1 px-2 mx-2 tx-center tx-bold tx-white bord-r-10 tx-lgx opaci-chov--75'
                onClick={()=>{
                  handleStart();
                }}
                style={{
                  backgroundColor: "#80DB7D",
                  boxShadow: "0px 4px 0 0px #4BaF49",
                }}
              >
                
                <div className='nodeco tx-lg bord-r-100  bord-r-100 pointer noverflow block pa-1 '
            
            >
              <img
              style={{
                paddingTop: "1px",
              }}
               src="/bew/pfp/row-4-column-1.png" alt="profile" width="30px" className=' bg-white bord-r-100 pointer noverflow block' />
            </div>
              </a></>
    );
  };
  