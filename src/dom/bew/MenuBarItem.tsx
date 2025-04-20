import { Tooltip } from 'react-tooltip';
export const MenuBarItem = ({ href, emoji, tooltip }: { href: string, emoji: string, tooltip: string }) => {
    return (<>
      <div className='tx-lgx flex-col opaci-chov--50'
      data-tooltip-id={`${tooltip}-tooltip`}
      data-tooltip-content={tooltip}
      data-tooltip-place="right"
      onClick={() => {
        if (href === "#") {
          alert("Coming soon!");
        } 
      }}
      >
        {/* home emoji */}
        <a href={href} className='nodeco pa-2 tx-center'>{emoji}</a>
        </div>
        <Tooltip id={`${tooltip}-tooltip`} className='z-100' />
        </>);
  };
  
  