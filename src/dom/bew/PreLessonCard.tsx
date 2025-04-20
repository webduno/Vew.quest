'use client';
import { LessonCardProps } from "./LessonsContainer";



export const PreLessonCard = ({
  title, href, emoji, backgroundColor = "#807DDB", boxShadowColor = "#6B69CF", styleOverride = {}, actionText = "Start"
}: LessonCardProps) => {
  return (
    <a
      href={href}
      target="_blank"
      className='pb-6 nodeco opaci-chov--75 tx-altfont-2 tx-bold gap-4  flex-col w-200px  bord-r-25'
      style={{
        border: "1px solid #E5E5E5",
        color: "#777777",
        ...styleOverride
      }}
    >
      <div className='tx-center pt-2 landing -title tx-xxxl'>{emoji}</div>
      <div className='tx-center tx-mdl landing -title pb-'>{title}</div>
      <div className="tx-center tx-smd landing -title tx-bold-4 w-150px" style={{
        color: "#22AEFF",
        wordWrap: 'break-word',
        overflowWrap: 'break-word'
      }}>
        {href.replace("https://", "").replace("http://", "").replace("www.", "")}
      </div>
      <div>
        <div
          className='py-2  px-8 nodeco tx-center tx-white bord-r-10 tx-lgx '
          style={{
            backgroundColor,
            boxShadow: `0px 4px 0 0px ${boxShadowColor}`,
          }}
        >
          {actionText}
        </div>
      </div>
    </a>
  );
};
