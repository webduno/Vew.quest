'use client';
import { PreLessonCard } from "./PreLessonCard";



export const PreLessonsContainer = () => {
  const lessonsList = [
    {
      title: "Remote Viewing Wiki",
      emoji: "🌐",
      href: "https://www.reddit.com/r/remoteviewing/wiki/index/",
      backgroundColor: "#1094dE",
      boxShadowColor: "#006699",
      actionText: "Open"
    },
    {
      title: "What is Remote Viewing?",
      emoji: "🤔",
      href: "https://www.reddit.com/r/remoteviewing/wiki/basics/whatisremoteviewing",
      backgroundColor: "#807DDB",
      boxShadowColor: "#6B69CF",
      actionText: "Learn"
    },
    {
      title: "Remote Viewing History",
      emoji: "📜",
      href: "http://www.remoteviewed.com/remote-viewing-history/",
      backgroundColor: "#FFB6C1",
      boxShadowColor: "#FF69B4",
      actionText: "Explore"
    },
    {
      title: "Remote Viewing Protocols",
      emoji: "📋",
      href: "http://www.remoteviewed.com/remote-viewing-protocols/",
      backgroundColor: "#E8A874",
      boxShadowColor: "#bB733E",
      actionText: "Practice"
    },
    {
      title: "Remote Viewing Beginner's Guide",
      emoji: "🧑🏻‍🏫",
      href: "https://www.reddit.com/r/remoteviewing/wiki/guide",
      backgroundColor: "#77CC4F",
      boxShadowColor: "#68A82F",
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
