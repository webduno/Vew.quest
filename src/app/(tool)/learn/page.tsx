'use client';
import { useState, useCallback, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import JSConfetti from 'js-confetti';

import QUIZ_DATA from '@/../script/state/constant/remote_viewing_quiz_full.json';
import { usePlayerStats } from '@/../script/state/hook/usePlayerStats';
import { useBackgroundMusic } from '@/../script/state/context/BackgroundMusicContext';
import { generateRandomTargetRandomized } from '@/../script/utils/platform/generateRandomTargetRandomized';
import { calculateAccuracy } from '@/../script/utils/play/calculateAccuracy';
import { isMobile } from '@/../script/utils/platform/mobileDetection';
import { useFetchedStats } from '@/script/state/context/FetchedStatsContext';

import targetsData from '@/../public/data/targets_1.json';
import { VewPanelTool } from '@/dom/organ/vew_tool/VewPanelTool';
import { WrappedBewUserStatsSummary } from '../../../dom/organ/vew_tool/BewUserStatsSummary';
import { VewToolLogin } from '@/dom/organ/vew_tool/VewToolLogin';
import { ToolResultsCard } from '../../../dom/organ/vew_tool/ToolResultsCard';
import { MenuIconBar } from '@/dom/organ/vew_tool/MenuIconBar';
import { VewMobileHeader } from '@/dom/organ/vew_tool/VewMobileHeader';
import { VewToolTitleNav } from '@/dom/organ/vew_tool/VewToolTitleNav';
import { VewPreviewImage } from '../../../dom/organ/vew_tool/VewPreviewImage';
import { VewAltLogo } from '../../../dom/organ/vew_tool/VewAltLogo';
import { LearnToolCreateNav, LearnToolTitleNav } from '@/dom/organ/vew_learn/LearnToolTitleNav';
import { BewGreenBtn, BewPurpleBtn } from '@/dom/bew/BewBtns';

type TargetsData = {
  [key: string]: string;
};

export type GameState = 'initial' | 'playing' | 'results';

export default function TrainingPage() {
  const { isLoading, crvObjects, refetchStats } = useFetchedStats();
  const [initiallyAutoLoaded, setInitiallyAutoLoaded] = useState(false);
  const { playSoundEffect } = useBackgroundMusic();
  const [typedLessonTitle, setTypedLessonTitle] = useState("");
  useEffect(() => {
    if (isLoading) { return; }
    if (initiallyAutoLoaded) { return; }
    if (!LS_playerId) {
      // setEnterUsername(true);
      return;
    }
    console.log("crvObjects", crvObjects.length);
    setInitiallyAutoLoaded(true);
    if (crvObjects.length === 0) { 

      generateNewRound()
      return; 
    }
    // console.log("crvObjects 22", crvObjects);
    // console.log("initiallyAutoLoaded", initiallyAutoLoaded);

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

  try {
    const response = await fetch('/api/lesson/findOrCreate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: typedLessonTitle,
        content: JSON.stringify(QUIZ_DATA),
        creator_id: LS_playerId,
        lesson_id: Date.now().toString(), // Using timestamp as a unique ID
        progress: "0"
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create lesson');
    }

    const data = await response.json();
    console.log("Lesson created:", data);
    
    // Update the lesson string state with the quiz data
    setLessonString(data.data.title);
    setCoursingData(data.data);
    
    // Play success sound effect if available
    playSoundEffect?.("/sfx/short/sssccc.mp3");
    
  } catch (error) {
    console.error('Error creating lesson:', error);
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

  const handleSend = useCallback(async (params: {
    type: string;
    natural: number;
    temp: number;
    light: number;
    color: number;
    solid: number;
    confidence: number;
  }, noteData: any, drawingData: any) => {
    if (!target) return;
    setSentObject(params);
    const calculatedResults = {
      type: target.values.type.toLowerCase() === params.type.toLowerCase() ? true : false,
      natural: calculateAccuracy(target.values.natural, params.natural, true, false),
      temp: calculateAccuracy(target.values.temp, params.temp, true, false),
      light: calculateAccuracy(target.values.light, params.light, false, false),
      color: calculateAccuracy(target.values.color, params.color, false, false),
      solid: calculateAccuracy(target.values.solid, params.solid, false, false),
      confidence: calculateAccuracy(target.values.confidence, params.confidence, true, false),
    };
    const overallAccuracy = (
      calculatedResults.natural +
      calculatedResults.temp +
      calculatedResults.light +
      calculatedResults.color +
      calculatedResults.solid ) / 5;


    setOverallAccuracy(overallAccuracy);
    setResults(calculatedResults);
    setGameState('results');

    // save to supabase
    const saveResponse = await fetch('/api/supabase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        objList: {
          sent: {
            ...params,
          },
          notes: noteData,
          sketch: drawingData,
          target: target?.values,
          ai_sent_guess: "n/a",
          target_id: selectedTargetInfo?.id.padStart(12, '0'),
        },
        storageKey: LS_playerId
      })
    });
    
    playSoundEffect("/sfx/short/sssccc.mp3")
    // Refetch stats after saving new data
    await refetchStats();

    // image if sketch is not null modal
    if (sketchData) {
      setShowSketchModal(true);
    } else {
      setShowImageModal(true);
    }
  }, [target, LS_playerId, refetchStats]);


  const handleFullSend = async (params: {
    sketch: any;
    notes: any;
    options: {type: string;
    natural: number;
    temp: number;
    light: number;
    color: number;
    solid: number;
    confidence: number;}
  }) => {
    // playSoundEffect("/sfx/short/sssccc.mp3")
    setSketchData(params.sketch);
    setNotes(params.notes);
    handleSend(params.options, params.notes, params.sketch, );
    
  }

  const handleTryAgain = async () => {
    const newTarget = await fetchRandomFromCocoDatabase();
    setShowImageModal(false);
    setShowSketchModal(false);
    setSketchData(null);
    setTarget(newTarget);
    setGameState('playing');
    setResults(null);
    setSentObject(null);
    setTimeout(async () => {
      playSoundEffect("/sfx/short/cling.mp3")
  }, 200);
}

const handleModuleClick = (moduleIndex: number) => {
  setSelectedModule(moduleIndex);
  setCurrentQuestionIndex(0);
  playSoundEffect?.("/sfx/short/sssccc.mp3");
};

const handleNextQuestion = () => {
  if (!coursingData) return;
  const moduleQuestions = JSON.parse(coursingData.content)[selectedModule!].en;
  if (currentQuestionIndex < moduleQuestions.length - 1) {
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    playSoundEffect?.("/sfx/short/cling.mp3");
  } else {
    setSelectedModule(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    playSoundEffect?.("/sfx/short/sssccc.mp3");
  }
};

interface QuestionViewProps {
  question: string;
  options: Array<{
    text: string;
    correct: boolean;
  }>;
  playSoundEffect?: (sound: string) => void;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
}

const QuestionView = ({ question, options, playSoundEffect, onNextQuestion, isLastQuestion }: QuestionViewProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  return (
    <div className='flex-col gap-4 w-100'>
      <div className="tx-bold opaci-50 tx-ls-1 w-300px mb-4 tx-center">
        {question}
      </div>
      <div 
        className='border-gg bord-r-25 tx-mdl  w-90 py-4'
        style={{
          animation: 'fadeIn 0.3s ease-in-out'
        }}
      >
        <div className="flex-col gap-4">
          <div className="flex-col gap-2">
            {options.map((option, oIndex) => (
              <div 
                key={oIndex} 
                className={`pa-1 w-250px border-gg bord-r-25 tx-center pointer  
                  ${selectedAnswer === oIndex ? (option.correct ? 'bg-green-100' : 'bg-red-100') : ''}`}
                onClick={() => {
                  setSelectedAnswer(oIndex);
                  setIsAnswerCorrect(option.correct);
                  playSoundEffect?.(option.correct ? "/sfx/short/sssccc.mp3" : "/sfx/short/cling.mp3");
                }}
              >
                {option.text}
              </div>
            ))}
          </div>
          {selectedAnswer !== null && (
            <div className={`tx-center mt-4 ${isAnswerCorrect ? 'tx-green' : 'tx-red'}`}>
              {isAnswerCorrect ? 'Correct! 🎉' : 'Incorrect, try again! ❌'}
            </div>
          )}
          <div className="flex-center mt-8">
            <button 
              onClick={onNextQuestion}
              className="bg-b-50 hover:bg-b-40 text-white font-bold py-2 px-4 bord-r-25"
            >
              {isLastQuestion ? 'Back to Modules' : 'Next Question'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

  return (
    <div className='w-100  flex-col flex-justify-start autoverflow-y'>
      
      <div className='w-100  flex-col  '>
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
                 target={lessonString.slice(0, 10)} setShowImageModal={setShowImageModal}
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
                    <div className='tx-center tx-altfont-2 gap-2  w-100 tx-black flex-col h-100'>
                      <div>{"1)"} Whats the purpose of your lesson?</div>
                      <input type="text" className='tx-lg pa-2 bord-r-25 border-gg tx-center'
                      value={typedLessonTitle}
                      onChange={(e) => {
                        setTypedLessonTitle(e.target.value);
                      }}
                       />
                      <BewGreenBtn text="Create Lesson" onClick={() => {
                        handleGenerateLesson()
                      }} />
                      {isLoadingLessons ? (
                        <div className='tx-center'>Loading lessons...</div>
                      ) : lessonsList && lessonsList.length > 0 ? (
                        <div className='flex-col gap-2 mt-4'>
                          <div className='tx-center tx-lg'>Your Lessons:</div>
                          {lessonsList.map((lesson) => (
                            <div 
                              key={lesson.lesson_id}
                              className='border-gg bord-r-25 pa-2 tx-center cursor-pointer hover:bg-glass-10'
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
                                    }
                                  } catch (error) {
                                    console.error('Error fetching lesson data:', error);
                                  }
                                };
                                fetchLessonData();

                                playSoundEffect?.("/sfx/short/sssccc.mp3");
                              }}
                            >
                              {lesson.title}
                              <div className='w-100 pointer tx-sm tx-ls-5 opaci-50 pt-2'>
                                Continue
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </>)}
                    {!!lessonString && (<>
<div id='main-content-container'
 className=' flex-col pt-4 relative w-100 '>
  {coursingData && selectedModule === null ? (
    // Module List View
    JSON.parse(coursingData.content).map((section: any, index: number) => {
      const itemsInArray = Object.keys(section?.["en"]).length;
      // calculate x position based on math sin function
      const steps = Array.from({ length: itemsInArray }, (_, i) => Math.sin(i * 0.1) * 100);
      const xOffset = steps[index % steps.length];
      return (
        <div 
          key={index}
          onClick={() => handleModuleClick(index)}
          className='border-gg bord-r-25 tx-lg  cursor-pointer  pointer'
          style={{
            transform: `translateX(${xOffset}%)`,
            transition: 'transform 0.3s ease-in-out'
          }}
        >
          <div className="font-bold tx-center">Module {index + 1}</div>
          <div className="tx-center opaci-50">{section.en[0].question}</div>
        </div>
      );
    })
  ) : (
    // Question View
    coursingData && selectedModule !== null && (
      <QuestionView
        question={JSON.parse(coursingData.content)[selectedModule].en[currentQuestionIndex].question}
        options={JSON.parse(coursingData.content)[selectedModule].en[currentQuestionIndex].options}
        playSoundEffect={playSoundEffect}
        onNextQuestion={handleNextQuestion}
        isLastQuestion={currentQuestionIndex === JSON.parse(coursingData.content)[selectedModule].en.length - 1}
      />
    )
  )}
</div>
</>)}

                </div>

              </div>



              {!isMobile() && crvObjects.length > 0 && (<>
                <div className='h-100 h-100vh w-250px pr-4 Q_sm_x' id="user-stats-bar">
                <WrappedBewUserStatsSummary />
                </div>
              </>)}



            </div>
          </div>
        )}

        {gameState !== 'results' && showImageModal && (<>
        <div className='pos-abs flex-col top-0 left-0 w-100 h-100 bg-glass-10  z-200'>
        <VewPreviewImage selectedTargetInfo={selectedTargetInfo} 
          setShowImageModal={setShowImageModal} 
        />

                    </div>
        </>)}



        {gameState === 'results' && results && target && (myRequests?.length === 0 || !myRequests) && (<>
        <div className='flex-col z-1000 w-100 pos-abs top-0 left-0 pt-4'
        style={{
          filter: "hue-rotate(160deg) brightness(1.5)",
        }}
        >
      <VewAltLogo />
          

        </div>
          <ToolResultsCard
            target={target}
            results={results}
            sentObject={sentObject}
            overallAccuracy={overallAccuracy}
            showImageModal={showImageModal}
            setShowImageModal={setShowImageModal}
            showSketchModal={showSketchModal}
            setShowSketchModal={setShowSketchModal}
            sketchData={sketchData}
            notes={notes}
            handleTryAgain={handleTryAgain}
            selectedTargetInfo={selectedTargetInfo}
          />
        </>)}

    </div>
    </div>
  );
} 







