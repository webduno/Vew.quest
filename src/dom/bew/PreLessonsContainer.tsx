'use client';
import { PreLessonCard } from "./PreLessonCard";



export const PreLessonsContainer = () => {
  const lessonsList = [
    {
      title: "Remote Viewing Wiki",
      emoji: "🔮",
      href: "https://www.reddit.com/r/remoteviewing/wiki/index/",
      backgroundColor: "#807DDB",
      boxShadowColor: "#6B69CF",
      actionText: "Learn"
    },
    {
      title: "What is Remote Viewing?",
      emoji: "❓",
      href: "https://www.reddit.com/r/remoteviewing/wiki/basics/whatisremoteviewing",
      backgroundColor: "#807DDB",
      boxShadowColor: "#6B69CF",
      actionText: "Learn"
    },
    {
      title: "Remote Viewing History",
      emoji: "👁️",
      href: "http://www.remoteviewed.com/remote-viewing-history/",
      backgroundColor: "#7DDB80",
      boxShadowColor: "#6B9F6D",
      actionText: "Explore"
    },
    {
      title: "Remote Viewing Protocols",
      emoji: "🎯",
      href: "http://www.remoteviewed.com/remote-viewing-protocols/",
      backgroundColor: "#5B9FE3",
      boxShadowColor: "#4A83BD",
      actionText: "Practice"
    },
    {
      title: "Remote Viewing Beginner's Guide",
      emoji: "🧘",
      href: "https://www.reddit.com/r/remoteviewing/wiki/guide",
      backgroundColor: "#9C7DDB",
      boxShadowColor: "#7E65B2",
      actionText: "Begin"
    },
    {
      title: "Books and manuals",
      emoji: "📚",
      href: "https://www.reddit.com/r/remoteviewing/wiki/resources/books",
      backgroundColor: "#5B9FE3",
      boxShadowColor: "#4A83BD",
      actionText: "Read"
    },
  ];

  return (
    <div className="flex-wrap w-100 gap-4 w-max-1080px pb-100" id="lessonsList-container">
      {lessonsList.map((lesson, index) => (
        <PreLessonCard
          styleOverride={{
            width: "300px"
          }}
          key={index}
          title={lesson.title}
          emoji={lesson.emoji}
          href={lesson.href}
          backgroundColor={lesson.backgroundColor}
          boxShadowColor={lesson.boxShadowColor}
          actionText={lesson.actionText} />
      ))}
    </div>
  );
};
