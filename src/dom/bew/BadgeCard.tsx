'use client';
import { BadgeCardProps } from "./LessonsContainer";


export const BadgeCard = ({ 
  actionStyle = {}, 
  forcedClick,
  title, href, emoji, backgroundColor = "#807DDB", boxShadowColor = "#6B69CF", styleOverride = {}, actionText = "Start"
}: BadgeCardProps) => {
  return (
    <a
      href={href}
      onClick={typeof forcedClick === 'function' ? forcedClick : () => {
        if (href === "#") {
          alert("Coming soon!");
          return;
        }
      }}
      className='pb-6 nodeco pos-rel opaci-chov--75 tx-altfont-2 tx-bold gap-4  flex-col w-150px  bord-r-25'
      style={{
        backgroundColor: "#f7f7f7",
        boxShadow: "0 4px #cccccc",
        color: "#777777",
        ...styleOverride
      }}
    >
      <div className='pos-abs pa-5 mb-4 bg-b-40'
      style={{filter:"blur(10px)"}}
      >
      </div>
      <div className={`tx-center pt-2 landing hover-${Math.floor(Math.random() * 20)} -title tx-xl`}>{emoji}</div>
      <div className='tx-center tx-mdl landing -title pb-'>{title}</div>
      {!!actionText && (
      <div>
        <div
          className='py-2 px-2 hover-jump-12 nodeco tx-center tx-white bord-r-10 tx- w-100px lg '
          style={{
            backgroundColor,
            boxShadow: `0px 4px 0 0px ${boxShadowColor}`,
            ...actionStyle
          }}
        >
          {actionText}
        </div>
      </div>
      )}
    </a>
  );
};
