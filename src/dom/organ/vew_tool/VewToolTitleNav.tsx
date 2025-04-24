import { Tooltip } from "react-tooltip";

export const VewToolTitleNav = ({target, setShowImageModal, playSoundEffect}: {target: any, setShowImageModal: (show: any) => void, playSoundEffect: (sound: string) => void}) => {
    return (
      <div className='pos-rel tx-white ma-4 pa-4 mt-0 bord-r-15 tx-altfont-2 flex-col flex-align-start gap-2'
                  style={{
                    background: "#807DDB",
                    boxShadow: "0 4px 0 #6B69CF",
                  }}
                  >
                  <a href="/dashboard"           style={{color: "#fafafa"}}     
                  className='opaci-50 nodeco pointer'>← Go to Dashboard</a>
                  <div className='tx-bold tx-lg'>Target Code #{target?.code}</div>
  
  
  
                  <div
                  style={{
                    transform: "translate(-100%,-25%)",
                    background: "#fafafa",
                    boxShadow: "0 4px 0 #cccccc",
                    width: "40px",
                    height: "40px",
                  }}
                  onClick={() => {
                    playSoundEffect("/sfx/short/chairsit.mp3")
                    setShowImageModal( (prev: any) => !prev);
                  }}
                  data-tooltip-id="image-preview-tooltip"
                  data-tooltip-content="View Target"
                  data-tooltip-place="bottom"
                  data-tooltip-variant='light'
                  className='m r-4 pointer flex-row gap-2 bg-b-10 flex-col  bord-r-100 pos-abs right-0 top-0'>
                    {/* eye emoji */}
                    <div className='tx-mdl'>👀</div>
                  </div>
                  <Tooltip id="image-preview-tooltip" />
                  </div>
    );
  };
  