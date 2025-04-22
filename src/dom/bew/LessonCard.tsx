'use client';
import { LessonCardProps } from "./LessonsContainer";


export const LessonCard = ({ 
  actionStyle = {}, 
  title, href, emoji, backgroundColor = "#807DDB", boxShadowColor = "#6B69CF", styleOverride = {}, actionText = "Start"
}: LessonCardProps) => {
  return (
    <a
      href={href}
      onClick={() => {
        if (href === "#") {
          alert("Coming soon!");
          return;
        }
      }}
      className='pb-6 nodeco opaci-chov--75 tx-altfont-2 tx-bold gap-4  flex-col w-150px  bord-r-25'
      style={{
        border: "1px solid #E5E5E5",
        color: "#777777",
        ...styleOverride
      }}
    >
      <div className='tx-center pt-2 landing -title tx-xl'>{emoji}</div>
      <div className='tx-center tx-mdl landing -title pb-'>{title}</div>
      {!!actionText && (
      <div>
        <div
          className='py-2 px-2  nodeco tx-center tx-white bord-r-10 tx- w-100px lg '
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
