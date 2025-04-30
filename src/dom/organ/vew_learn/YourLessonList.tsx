'use client';

const donetodayorYtday = (updatedAt: string) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const updateDate = new Date(updatedAt);
  
  if (updateDate.toDateString() === today.toDateString()) {
    return true;
  }
  if (updateDate.toDateString() === yesterday.toDateString()) {
    return true;
  }
  return false;
}
const getBorderStyle = (updatedAt: string) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const updateDate = new Date(updatedAt);
  
  if (updateDate.toDateString() === today.toDateString()) {
    return { border: '2px solid #B7D9A6' }; // emerald-400 equivalent
  }
  if (updateDate.toDateString() === yesterday.toDateString()) {
    return { border: '2px solid #F0EBCE' }; // yellow-400 equivalent
  }
  return { border: '2px solid #eaeaea' }; // gray-200 equivalent
}

export const YourLessonList = ({
  lessonsList, isLoadingLessons, setLessonString, LS_playerId, setCoursingData, playSoundEffect
}: {
  lessonsList: { lesson_id: string; title: string; updated_at: string }[] | null;
  isLoadingLessons: boolean;
  setLessonString: (str: string) => void;
  LS_playerId: string | null;
  setCoursingData: (data: any) => void;
  playSoundEffect: ((path: string) => void) | undefined;
}) => {
  if (isLoadingLessons) {
    return <div className='tx-center'>Loading lessons...</div>;
  }

  if (!lessonsList || lessonsList.length === 0) {
    return null;
  }

  return (
    <>
    <div className="flex-row gap-4 w-90 ">
                      <hr className='flex-1 opaci-20 ' />
                      <div className='opaci-20 pt-2 tx-lgx'>°</div>
                      <hr className='flex-1 opaci-20 ' />
                      </div>
      {/* <div className='tx-center tx-lg mt-4'>Your Lessons:</div> */}
      <div className='flex-row  tx-smd flex-justify-between  pb-4 w-100  gap-2 '>
          <div className='tx-bold px-4' 
          style={{
            color: "#4B4B4B",
          }}
          >Your Lessons</div>
          <a 
          className='tx-bold px-4 pointer nodeco' 
          href="/dashboard#resources"
          style={{
            color: "#22AEFF",
          }}
          >View All</a>
        </div>
      <div className='flex-wrap gap-1  w-100  pb-100 '>
        {lessonsList.map((lesson) => (
          <div
            key={lesson.lesson_id}
            className='bord-r-15 pa-2 py-4 tx-start pointer w-100 flex-row'
            style={{
              ...getBorderStyle(lesson.updated_at),
              borderRadius: '15px'
            }}
            onClick={() => {
              setLessonString(lesson.title);

              // fetch full lesson data by id
              const fetchLessonData = async () => {
                try {
                  const response = await fetch(`/api/lesson/findOrCreate`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      lesson_id: lesson.lesson_id,
                      creator_id: LS_playerId,
                    }),
                  });
                  if (!response.ok) {
                    throw new Error('Failed to fetch lesson data');
                  }
                  const data = await response.json();
                  if (data.success) {
                    setCoursingData(data.data);
                    setLessonString(data.data.title);
                  }
                } catch (error) {
                  console.error('Error fetching lesson data:', error);
                }
              };
              fetchLessonData();

              playSoundEffect?.("/sfx/short/sssccc.mp3");
            }}
          >
            <div>
              {/* single book emoji */}
              <div className="tx-lg pr-2">{!donetodayorYtday(lesson.updated_at) ? "📚" : "📖"}</div>
            </div>
            <div className="flex-col flex-1 flex-align-start">
              <div className=' tx-sm tx-ls-  opaci-75 '>{lesson.title.toUpperCase()}</div>
              <div className=' tx-xs tx-ls-  opaci-50 pt-1 tx-ls-1'>
                Last Updated: {lesson.updated_at.split('T')[0]}
              </div>
            </div>
            {/* <div className='w-100  tx-sm tx-ls- opaci-25 pt-2'>Click to Start</div> */}
          </div>
        ))}
      </div>
    </>
  );
};
