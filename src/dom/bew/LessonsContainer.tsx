'use client';

import { LessonCard } from "./LessonCard";

export interface LessonCardProps {
  title: string;
  href: string;
  emoji: string;
  backgroundColor?: string;
  boxShadowColor?: string;
  styleOverride?: React.CSSProperties;
  actionText?: string;
}

export const LessonsContainer = () => {
  const lessonsList = [
    {
      title: "Your Achievements",
      emoji: "⚡",
      href: "/tool",
      backgroundColor: "#5BA386",
      boxShadowColor: "#4A856D",
      actionText: "Open Goal & Progress Board"
    },
    {
      title: "Global Ranking",
      emoji: "🏆",
      href: "#",
      backgroundColor: "#aD8574",
      boxShadowColor: "#7D5544",
      actionText: "Public Leaderboard"
    },
    {
      title: "Your Journey",
      emoji: "💭",
      href: "#",
      backgroundColor: "#C3B4D0",
      boxShadowColor: "#9F86A8",
      actionText: "Review Logs & Viewing History"
    },
    {
      title: "Daily Goals",
      emoji: "🧠",
      href: "#",
      backgroundColor: "#FFB6C1",
      boxShadowColor: "#FF69B4",
      actionText: "Check Goals"
    },
    {
      title: "Weekly Challenges",
      emoji: "📅",
      href: "#",
      backgroundColor: "#1094dE",
      boxShadowColor: "#006699",
      actionText: "View Challenges"
    },
    {
      title: "Report a Bug",
      // warning sign
      emoji: "⚠️",
      href: "#",
      backgroundColor: "#FFc04E",
      boxShadowColor: "#dF900E",
      actionText: "Submit Issue"
    },
  ];

  return (
    <div className="flex-wrap w-100 gap-8 w-max-700px pb-100" id="lessonsList-container">
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
        />
      ))}
    </div>
  );
};
