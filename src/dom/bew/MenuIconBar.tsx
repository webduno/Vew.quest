import { MenuBarItem } from '@/dom/bew/MenuBarItem';

interface MenuIconBarProps {
  playSoundEffect: (sound: string) => void;
}

export const MenuIconBar = ({  playSoundEffect }: MenuIconBarProps) => {
  return (
    <div id="menu-icon-bar" className='h-100vh Q_sm_x'
      style={{ borderRight: "1px solid #E5E5E5" }}
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
        href="/dashboard#resources"
        emoji="📚"
        tooltip="Resources"
      />

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
  );
}; 