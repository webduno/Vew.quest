'use client';
import { useState, useEffect } from 'react';
import JSConfetti from 'js-confetti';

import { usePlayerStats } from '@/../script/state/hook/usePlayerStats';
import { useBackgroundMusic } from '@/../script/state/context/BackgroundMusicContext';
import { generateRandomTargetRandomized } from '@/../script/utils/platform/generateRandomTargetRandomized';
import { isMobile } from '@/../script/utils/platform/mobileDetection';
import { useFetchedStats } from '@/script/state/context/FetchedStatsContext';

import targetsData from '@/../public/data/targets_1.json';
import { WrappedBewUserStatsSummary } from '../../../dom/organ/vew_tool/BewUserStatsSummary';
import { VewToolLogin } from '@/dom/organ/vew_tool/VewToolLogin';
import { MenuIconBar } from '@/dom/organ/vew_tool/MenuIconBar';
import { VewMobileHeader } from '@/dom/organ/vew_tool/VewMobileHeader';
import { LearnToolCreateNav, LearnToolTitleNav } from '@/dom/organ/vew_learn/LearnToolTitleNav';
import { BewGreenBtn } from '@/dom/bew/BewBtns';
import { QuestionView } from '@/dom/organ/vew_learn/QuestionView';
import { ModuleList } from '@/dom/organ/vew_learn/ModuleList';

type TargetsData = {
  [key: string]: string;
};

export type GameState = 'initial' | 'playing' | 'results';

export default function TrainingPage() {
  const { isLoading, crvObjects, refetchStats } = useFetchedStats();
  const [initiallyAutoLoaded, setInitiallyAutoLoaded] = useState(false);
  const { playSoundEffect } = useBackgroundMusic();
  const [typedLessonTitle, setTypedLessonTitle] = useState("");
  const [isCreatingLesson, setIsCreatingLesson] = useState(false);
  const [lessonError, setLessonError] = useState<string | null>(null);
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const getRandomEmoji = () => {
    // Common emoji ranges
    const ranges = [
      [0x1F300, 0x1F3FF], // Miscellaneous Symbols and Pictographs
      [0x1F400, 0x1F64F], // Emoticons and additional symbols
      [0x1F680, 0x1F6FF], // Transport and Map Symbols
      [0x2600, 0x26FF],   // Miscellaneous Symbols
      [0x2700, 0x27BF],   // Dingbats
    ];
    
    // Pick a random range
    const range = ranges[Math.floor(Math.random() * ranges.length)];
    // Get a random code point within the range
    const codePoint = range[0] + Math.floor(Math.random() * (range[1] - range[0] + 1));
    // Convert code point to emoji
    return String.fromCodePoint(codePoint);
  };
  
  const addRandomEmoji = () => {
    const randomEmoji = getRandomEmoji();
    setTypedLessonTitle(prev => {
      // Check if the first character is an emoji (basic check for surrogate pairs)
      const firstCharCode = prev.charCodeAt(0);
      if (firstCharCode && firstCharCode >= 0x1F300) {
        // Find the length of the first emoji (could be 1-2 code units)
        const emojiLength = prev.codePointAt(0)! > 0xFFFF ? 2 : 1;
        return randomEmoji + prev.substring(emojiLength);
      }
      return randomEmoji + prev;
    });
    playSoundEffect?.("/sfx/short/cling.mp3");
  };

  useEffect(() => {
    if (isLoading) { return; }
    if (initiallyAutoLoaded) { return; }
    if (!LS_playerId) {
      // setEnterUsername(true);
      return;
    }
    setInitiallyAutoLoaded(true);
    if (crvObjects.length === 0) { 

      generateNewRound()
      return; 
    }

    handleStart();

  }, [isLoading]);
  const [ wndwTg, s__wndwTg] = useState<any>(null);
  const [ telegram_id, s__telegram_id] = useState<string | null>(null);

  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     console.log("window.Telegram", window.Telegram);

  //   }
  //     if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
  //     s__wndwTg(window.Telegram.WebApp);
  //     const thenewid = window.Telegram.WebApp.initDataUnsafe?.user?.id || null;
  //     console.log("thenewid", thenewid);
  //     s__telegram_id(thenewid);
  //     if (thenewid) {
  //       setPlayerId(thenewid);
  //       localStorage.setItem('VB_PLAYER_ID', thenewid);
  //       generateNewRound()

  //     }
  //   }
  // }, []);

const handleGenerateLesson = async () => {
  if (!LS_playerId) {
    console.error("No player ID found");
    return;
  }

  if (!typedLessonTitle.trim()) {
    setLessonError("Please enter a lesson title");
    return;
  }

  setIsCreatingLesson(true);
  setLessonError(null);

  try {
    // First generate the lesson content using AI
    const generateResponse = await fetch('/api/ai/generate-lesson', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: typedLessonTitle,
        difficulty: "beginner" // You can make this dynamic based on user input
      }),
    });

    if (!generateResponse.ok) {
      throw new Error('Failed to generate lesson content');
    }

    const generatedData = await generateResponse.json();
    if (!generatedData.success) {
      throw new Error('Failed to generate valid lesson content');
    }

    // Now save the generated content
    const saveResponse = await fetch('/api/lesson/findOrCreate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: typedLessonTitle,
        content: JSON.stringify(generatedData.data),
        creator_id: LS_playerId,
        lesson_id: Date.now().toString(),
        progress: "0"
      }),
    });

    if (!saveResponse.ok) {
      throw new Error('Failed to save lesson');
    }

    const saveData = await saveResponse.json();
    
    // Update the lesson string state with the quiz data
    setLessonString(saveData.data.title);
    setCoursingData(saveData.data);
    
    // Play success sound effect if available
    playSoundEffect?.("/sfx/short/sssccc.mp3");
    
  } catch (error) {
    console.error('Error creating lesson:', error);
    setLessonError(error instanceof Error ? error.message : 'Failed to create lesson');
  } finally {
    setIsCreatingLesson(false);
  }
};
  const generateNewRound = async () => {
    const newTarget = await fetchRandomFromCocoDatabase();
    setTarget(newTarget);
    setGameState('playing');
    setResults(null);
    setSentObject(null);
  }

  const { LS_playerId, typedUsername, setTypedUsername, setPlayerId, sanitizePlayerId } = usePlayerStats();
  const [enterUsername, setEnterUsername] = useState(false);
  const [isLoadingMyRequests, setIsLoadingMyRequests] = useState(false);
  const [myRequests, setMyRequests] = useState<null | {
    description: string;
    bounty: number;
    attempts: number;
    solved: number;
    created_at: string;
  }[]>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enableLocked, setEnableLocked] = useState(false);
  const [gameState, setGameState] = useState<GameState>('initial');
  const [successRequest, setSuccessRequest] = useState(false);
  const [sentObject, setSentObject] = useState<null | {
    type: string;
    natural: number;
    temp: number;
    light: number;
    color: number;
    solid: number;
    confidence: number;
  }>(null); 
  const [target, setTarget] = useState<null | {
    code: string;
    values: {
      type: string;
      natural: number;
      temp: number;
      light: number;
      color: number;
      solid: number;
      confidence: number;
    }
  }>(null);
  const [selectedTargetInfo, setSelectedTargetInfo] = useState<null | {
    id: string;
    description: string;
  }>(null);
  const [overallAccuracy, setOverallAccuracy] = useState<number>(0);
  const [results, setResults] = useState<null | {
    type: boolean;
    natural: number;
    temp: number;
    light: number;
    color: number;
    solid: number;
    confidence: number;
  }>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showSketchModal, setShowSketchModal] = useState(false);
  const [sketchData, setSketchData] = useState<any>(null);
  const [notes, setNotes] = useState<any>(null);



  const [coursingData, setCoursingData] = useState<any>(null);
  const [lessonString, setLessonString] = useState<string>("");
  const [lessonsList, setLessonsList] = useState<{lesson_id: string, title: string}[]>([]);
  const [isLoadingLessons, setIsLoadingLessons] = useState(false);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<{ text: string; correct: boolean }[]>([]);

  const updateProgress = async (moduleIndex: number, questionIndex: number, selectedAnswerIndex: number) => {
    if (!coursingData || !LS_playerId) return;
    
    try {
      // Initialize fresh progress structure
      let currentProgress: any[] = [];
      
      try {
        // Try to parse existing progress, if it fails or is null, use fresh structure
        currentProgress = coursingData.progress ? JSON.parse(coursingData.progress) : [];
      } catch (e) {
        console.error('Error parsing progress, using fresh structure:', e);
        currentProgress = [];
      }
      
      // Ensure progress is an array
      if (!Array.isArray(currentProgress)) {
        currentProgress = [];
      }
      
      // Ensure the module exists in progress
      if (!currentProgress[moduleIndex]) {
        currentProgress[moduleIndex] = {"en": []};
      }
      
      // Ensure the module has the correct structure
      if (!currentProgress[moduleIndex].en) {
        currentProgress[moduleIndex] = {"en": []};
      }
      
      // Get the current question data
      const moduleContent = JSON.parse(coursingData.content);
      const currentQuestion = moduleContent[moduleIndex].en[questionIndex];
      
      // Ensure the question exists in progress and update with question string and selected answer
      if (!currentProgress[moduleIndex].en[questionIndex]) {
        currentProgress[moduleIndex].en[questionIndex] = {
          date: new Date().toISOString(),
          answered: true,
          question: currentQuestion.question,
          selectedAnswer: selectedAnswerIndex
        };
      } else {
        currentProgress[moduleIndex].en[questionIndex].date = new Date().toISOString();
        currentProgress[moduleIndex].en[questionIndex].answered = true;
        currentProgress[moduleIndex].en[questionIndex].question = currentQuestion.question;
        currentProgress[moduleIndex].en[questionIndex].selectedAnswer = selectedAnswerIndex;
      }

      const response = await fetch('/api/lesson/findOrCreate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: coursingData.title,
          content: coursingData.content,
          creator_id: LS_playerId,
          lesson_id: coursingData.lesson_id,
          progress: JSON.stringify(currentProgress)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update progress');
      }

      const data = await response.json();
      if (data.success) {
        setCoursingData(data.data);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const fetchLessons = async () => {
    setIsLoadingLessons(true);
    try {
      const response = await fetch(`/api/lesson/list?creator_id=${LS_playerId}`);
      const data = await response.json();
      if (data.success) {
        setLessonsList(data.data);
        // setLessonsList(data.title);
        // setCoursingData(data);
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
    setIsLoadingLessons(false);
  };

  useEffect(() => {
    if (!LS_playerId) return;
    
    fetchLessons();
  }, [LS_playerId]);



  

  async function fetchRandomFromCocoDatabase() {
    // check if user has ability to play audio and cliiked anything or interacted with the page
    

    const confetti = new JSConfetti();
    confetti.addConfetti({
      // confettiColors: ['#FDC908', '#7DDB80', '#807DDB', '#6DcB70'],
      // different question mark emojis
emojiSize:50,
      emojis: ["❔"],
      confettiNumber: 15,
    });
    try {
      // Get random key from the object
      const keys = Object.keys(targetsData as TargetsData);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      const targetData = (targetsData as TargetsData)[randomKey];
      
      // Split the data into description and values
      const [description, valuesStr] = targetData.split('\n');
      const [type, natural, temp, light, color, solid, confidence] = valuesStr.split(',').map(Number);
      
      // Update the selected target info
      setSelectedTargetInfo({
        id: randomKey,
        description: description.trim()
      });
      
      const typeString = ['object', 'entity', 'place', 'event'][type - 1];
      return {
        code: randomKey,
        values: {
          type: typeString,
          natural,
          temp,
          light,
          color,
          solid,
          confidence
        }
      };
    } catch (error) {
      console.error('Error reading from COCO database:', error);
      // Fallback to random generation if there's an error
      return generateRandomTargetRandomized();
    }
  }

  const handleStart = async () => {
    if (!LS_playerId && !typedUsername) {
      setEnterUsername(true);
      return;
    }

    if (!LS_playerId && typedUsername) {
      const sanitizedId = sanitizePlayerId(typedUsername);
      setPlayerId(sanitizedId);
      localStorage.setItem('VB_PLAYER_ID', sanitizedId);
      await refetchStats();
    }

    const newTarget = await fetchRandomFromCocoDatabase();
    setTarget(newTarget);
    setGameState('playing');
    setResults(null);
    setSentObject(null);
  };


const handleModuleClick = (moduleIndex: number) => {
  setSelectedModule(moduleIndex);
  setCurrentQuestionIndex(0);
  setSelectedAnswer(null);
  setIsAnswerCorrect(null);
  
  // Shuffle options for the first question
  const moduleQuestions = JSON.parse(coursingData.content)[moduleIndex].en;
  const options = moduleQuestions[0].options;
  const shuffled = [...options];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  setShuffledOptions(shuffled);
  
  playSoundEffect?.("/sfx/short/sssccc.mp3");
};

const handleNextQuestion = () => {
  if (!coursingData) return;
  const moduleQuestions = JSON.parse(coursingData.content)[selectedModule!].en;
  if (currentQuestionIndex < moduleQuestions.length - 1) {
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    
    // Shuffle options for the next question
    const options = moduleQuestions[currentQuestionIndex + 1].options;
    const shuffled = [...options];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setShuffledOptions(shuffled);
    
    playSoundEffect?.("/sfx/short/cling.mp3");
  } else {
    setSelectedModule(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    playSoundEffect?.("/sfx/short/sssccc.mp3");
  }
};

const handleContinueGeneration = async () => {
  if (!coursingData || !LS_playerId) return;
  
  setIsGeneratingMore(true);
  setGenerationError(null);

  try {
    const response = await fetch('/api/ai/continue-lesson', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lesson_id: coursingData.lesson_id,
        creator_id: LS_playerId
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate more content');
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to generate valid content');
    }

    // Update the lesson data with new content
    setCoursingData({
      ...coursingData,
      content: JSON.stringify(data.data)
    });

    // Refresh the lessons list
    await fetchLessons();
    
    playSoundEffect?.("/sfx/short/sssccc.mp3");
  } catch (error) {
    console.error('Error generating more content:', error);
    setGenerationError(error instanceof Error ? error.message : 'Failed to generate more content');
  } finally {
    setIsGeneratingMore(false);
  }
};

  return (
    <div className='w-100  flex-col flex-justify-start autoverflow-y '>
      
      <div className='w-100  flex-col   '>
        {gameState === 'initial' && (
          <VewToolLogin
            gameState={gameState}
            setGameState={setGameState}
            typedUsername={typedUsername}
            setTypedUsername={setTypedUsername}
            isLoading={isLoading}
            handleStart={handleStart}
            sanitizePlayerId={sanitizePlayerId}
          />
        )}

        {gameState === 'playing' && (
          <div className='flex-col w-100 '>
            <div className='flex-row w-100  flex-justify-stretch flex-align-stretch'
              style={{ alignContent: "stretch"}}
            >

              <MenuIconBar  playSoundEffect={playSoundEffect} />

              <div className='flex-1 flex-col flex-align-stretch  flex-justify-start '>
                
                <VewMobileHeader />

                {<div className='Q_sm_x py-2 '> </div>}
                
                {!!lessonString && (<>
                <LearnToolTitleNav
                 target={lessonString} setShowImageModal={setShowImageModal}
                  playSoundEffect={playSoundEffect}
                 />
                 </>)}
                {!lessonString && (<>
                <LearnToolCreateNav
                 target={"Create"} setShowImageModal={setShowImageModal}
                  playSoundEffect={playSoundEffect}
                 />
                 </>)}

                <div className='flex-1  tx-altfont-2 flex-col flex-justify-start tx-altfont-2'>
                  {!lessonString && (<>
                    <div className='tx-center tx-altfont-2 pt-8 gap-2  w-100 tx-black flex-col h-100'>
                      <div>{"1)"} Whats the purpose of your lesson?</div>
                      <div className="flex-row gap-2 flex-center">
                        <input type="text" className='tx-lg pa-2 bord-r-25 border-gg tx-center'
                          value={typedLessonTitle}
                          onChange={(e) => {
                            setTypedLessonTitle(e.target.value);
                            setLessonError(null); // Clear error when user types
                          }}
                        />
                        
                      </div>
                      {lessonError && (
                        <div className="tx-red tx-sm mt-1">{lessonError}</div>
                      )}
                      <div className="flex-row gap-2 pb-8 ">
                      <button 
                          onClick={addRandomEmoji}
                          className="tx-lg pa-2 bord-r-25 border-gg pointer opaci-chov--50"
                          style={{
                            background: "#f7f7f7",
                          }}
                        >
                          🎲
                        </button>

                      <BewGreenBtn
                        text={isCreatingLesson ? "Creating..." : <>Create <br /> Lesson</>} 
                        onClick={handleGenerateLesson}
                        disabled={isCreatingLesson}
                      />
                      </div>

                      
                      <div className="flex-row gap-4 w-90 ">
                      <hr className='flex-1 opaci-20 ' />
                      <div className='opaci-20 pt-2 tx-lgx'>°</div>
                      <hr className='flex-1 opaci-20 ' />
                      </div>

                      <div className='tx-center tx-lg mt-4'>Your Lessons:</div>
                          {isLoadingLessons ? (
                        <div className='tx-center'>Loading lessons...</div>
                      ) : lessonsList && lessonsList.length > 0 ? (
                        <div className='flex-wrap gap-2 mt-4 w-90 pb-100'>
                          {lessonsList.map((lesson) => (
                            <div 
                              key={lesson.lesson_id}
                              className='border-gg bord-r-25 pa-2 py-4 tx-center pointer '
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
                              {/* {lesson.title} */}
                              <div className='w-90  tx-sm tx-ls- opaci-75 '>{lesson.title.toUpperCase()}</div>
                              <div className='w-100  tx-sm tx-ls- opaci-25 pt-2'>Click to Start</div>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </>)}
                    {!!lessonString && (<>
<div id='main-content-container'
 className=' flex-col gap-4 pt-4 relative  w-100 pos-rel pb-100'>
  {coursingData && selectedModule === null ? (<>
    <div className="flex-col pos-abs top-0  left-0  flex-justify-start flex-align-start  ml-4">
      <div className="flex-row gap-2  flex-justify-start flex-align-start z-100 ">
        <button
          className="tx-md bord-r-15 border-gg pa-2 px-4 bg-white pointer opaci-50"
          onClick={() => setLessonString("")}
        >
          ← Back
        </button>
        
      </div>
      {generationError && (
        <div className="tx-red tx-sm mt-2">{generationError}</div>
      )}
      </div>
      <div
      style={{ color: "#777777"}}
       className='tx-bold w-250px w-100 tx-center  pt-100' >{coursingData.title.toUpperCase()}</div>
    <div className="flex-col gap-4 w-100 ">
      <ModuleList 
        coursingData={coursingData}
        handleModuleClick={handleModuleClick}
      />
    </div>
    </>) : (
    // Question View
    coursingData && selectedModule !== null && (
      <>
        <div className="mb-2 flex-row flex-justify-start pos-abs top-0 ml-4 left-0">
          <button
            className="tx-md pa-2 px-4 bg-white pointer opaci-50"
            onClick={() => setSelectedModule(null)}
          >
            ← Back
          </button>
        </div>
        <QuestionView
          question={JSON.parse(coursingData.content)[selectedModule].en[currentQuestionIndex].question}
          options={shuffledOptions}
          playSoundEffect={playSoundEffect}
          onNextQuestion={handleNextQuestion}
          isLastQuestion={currentQuestionIndex === JSON.parse(coursingData.content)[selectedModule].en.length - 1}
          currentQuestionNumber={currentQuestionIndex + 1}
          totalQuestions={JSON.parse(coursingData.content)[selectedModule].en.length}
          onCorrectAnswer={updateProgress}
          moduleIndex={selectedModule}
          questionIndex={currentQuestionIndex}
          selectedAnswer={selectedAnswer}
          isAnswerCorrect={isAnswerCorrect}
          onAnswerSelect={(index, isCorrect) => {
            setSelectedAnswer(index);
            setIsAnswerCorrect(isCorrect);
          }}
        />
      </>
    )
  )}
</div>
</>)}

                </div>

              </div>



              {!isMobile() && crvObjects.length > 0 && (<>
                <div className='h-100  w-250px pr-4 Q_sm_x' id="user-stats-bar">
                <WrappedBewUserStatsSummary showResources={false} />
                </div>
              </>)}



            </div>
          </div>
        )}


    </div>
    </div>
  );
} 







