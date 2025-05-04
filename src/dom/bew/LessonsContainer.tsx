'use client';

import { useProfileSnackbar } from "@/script/state/context/useProfileSnackbar";
import { useBackgroundMusic } from "../../../script/state/context/BackgroundMusicContext";
import { LessonCard } from "./LessonCard";

export interface LessonCardProps {
  title: string;
  href: string;
  emoji: string;
  backgroundColor?: string;
  boxShadowColor?: string;
  styleOverride?: React.CSSProperties;
  actionText?: string;
  actionStyle?: React.CSSProperties;
  forcedClick?: () => void;
}
export interface BadgeCardProps {
  title: string;
  href: string;
  emoji: string;
  backgroundColor?: string;
  boxShadowColor?: string;
  styleOverride?: React.CSSProperties;
  actionText?: string;
  actionStyle?: React.CSSProperties;
  forcedClick?: () => void;
}

export const LessonsContainer = () => {
  const { playSoundEffect } = useBackgroundMusic();
  const { triggerSnackbar } = useProfileSnackbar();
  const lessonsList = [
    {
      title: "Your Achievements",
      emoji: "⚡",
      href: "/profile",
      backgroundColor: "#77CC4F",
      boxShadowColor: "#68A82F",
      actionText: "Open Your Profile",
      forcedClick: null
    },
    // {
    //   title: "Space Quest",
    //   emoji: "🌍",
    //   href: "/space",
    //   backgroundColor: "#30a4eA",
    //   boxShadowColor: "#0074BA",
    //   actionText: "Enter Space Quest",
    //   forcedClick: null
    // },
    {
      title: "Global Ranking",
      emoji: "🏆",
      href: "/leaderboard",
      backgroundColor: "#aD8574",
      boxShadowColor: "#7D5544",
      actionText: "Public Leaderboard",
      forcedClick: null
    },
    // {
    //   title: "3D World",
    //   emoji: "🛣️",
    //   href: "/world",
    //   backgroundColor: "#96C34A",
    //   boxShadowColor: "#66a31A",
    //   actionText: "Enter Main Plaza & Play",
    //   forcedClick: null
    // },
  //   {
  //     title: "Weekly Challenges",
  //     emoji: "📅",
  //     href: "#",
  //     backgroundColor: "#1094dE",
  //     forcedClick: () => {
  //       playSoundEffect('/sfx/short/errorbip.mp3');
  // triggerSnackbar(<div className='tx-center py-1'>
  //   <div className=''>
  //   Weekly Challenges <br /> are coming soon!
  //   </div>
  // </div>, "errorwarning");
  //     },
  //     boxShadowColor: "#006699",
  //     actionText: "View Challenges"
  //   },
    {
      title: "Report a Bug",
      // warning sign
      emoji: "⚠️",
      href: "/feedback",
      backgroundColor: "#FFc04E",
      boxShadowColor: "#dF900E",
      actionText: "Submit Issue",
      forcedClick: null
    },
  ];

  return (
    <div className="flex-wrap w-100 gap-8 w-max-700px" id="lessonsList-container">
      {lessonsList.map((lesson, index) => (
        <LessonCard 
          styleOverride={{
            // width: "300px"
            filter: lesson.href === "#" ? "saturate(0)" : "saturate(1)"
          }}
          key={index} 
          title={lesson.title} 
          emoji={lesson.emoji}
          href={lesson.href} 
          backgroundColor={lesson.backgroundColor} 
          boxShadowColor={lesson.boxShadowColor}
          actionText={lesson.actionText}
          forcedClick={lesson.forcedClick || undefined}
        />
      ))}
      {/* <LessonCard 
          styleOverride={{
            width: "250px",
            filter: "saturate(1)"
          }}
          key={"index"} 
          title={"lesson.title"} 
          emoji={"💭"}
          href={"lesson.href"} 
          // backgroundColor={"lesson.backgroundColor"} 
          // boxShadowColor={"lesson.boxShadowColor"}
          actionText={"lesson"}
          forcedClick={() => {}}
        /> */}
        {/* <a 
        href="/world"
        className="w-300px bord-r-25 pt-4 nodeco tx-black "
        style={{
          backgroundColor: "#EAF8FF",
          borderBottom: "4px solid #cAd8dF",
        }}
        >
          <div className="tx-center opaci-50 tx-bold tx-altfont-2 tx-lg">3D World</div>
          <div>
            <img src="/bew/worldisland.png" className="w-300px" alt="lesson-card-bg" />
          </div>
          </a>   */}

    </div>
  );
};
