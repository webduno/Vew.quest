import { MenuBarItem } from '@/dom/bew/MenuBarItem';

interface MenuIconBarProps {
  playSoundEffect: (sound: string) => void;
}

export const MenuIconBar = ({  playSoundEffect }: MenuIconBarProps) => {
  return (<>

<div id="menu-icon-bar_invisible" className=' Q_sm_x '
style={{
  borderRight: "3px solid #eaeaea"

}}
>

<a href="/" className='pointer'
  style={{
    visibility: "hidden",
  }}
>
        <img src="/bew/pnglogo.png" alt="tool_bg7" className='px-2 py-4 ' width="50px" />
      </a>

</div>



    <div id="menu-icon-bar" className=' Q_sm_x pos-abs'
      style={{
        // height: "100%",
        minHeight: "100vh",
         borderRight: "3px solid #eaeaea"
         }}
    >
      <a href="/" className='pointer'>
        <img src="/bew/pnglogo.png" alt="tool_bg7" className='px-2 py-4 ' width="50px" />
      </a>

      <MenuBarItem 
        href="/dashboard"
        emoji="🧮"
        tooltip="Dashboard"
      />

      <MenuBarItem 
        href="/party"
        emoji="🎉"
        tooltip="Party"
      />
      
      {/* <MenuBarItem 
        href="/space"
        emoji="🌎"
        tooltip="Space Quest"
      />
      
      <MenuBarItem 
        href="/learn"
        emoji="🧠"
        tooltip="Learn"
      /> */}

      <MenuBarItem 
        href="/leaderboard"
        emoji="🏆"
        tooltip="Leaderboard"
      />

      <MenuBarItem 
        href="/profile"
        emoji="👤"
        tooltip="Profile"
      />

      <MenuBarItem 
        href="/about"
        emoji="❓"
        tooltip="About"
      />
    </div>
  </>);
}; 