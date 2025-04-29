import { useState } from 'react';

interface QuestionViewProps {
  question: string;
  options: Array<{
    text: string;
    correct: boolean;
  }>;
  playSoundEffect?: (sound: string) => void;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
  currentQuestionNumber: number;
  totalQuestions: number;
}

export const QuestionView = ({ 
  question, 
  options, 
  playSoundEffect, 
  onNextQuestion, 
  isLastQuestion,
  currentQuestionNumber,
  totalQuestions 
}: QuestionViewProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  return (
    <div className='flex-col gap-4 w-100 pt-8'>
      <div className="tx-bold opaci-50 tx-ls-1 w-300px mb-4 tx-center">
        <div className="mb-2 tx-sm opaci-50">Question {currentQuestionNumber}/{totalQuestions}</div>
        {question}
      </div>
      <div 
        className='border-gg bord-r-25 tx-mdl w-90 py-4'
        style={{
          animation: 'fadeIn 0.3s ease-in-out'
        }}
      >
        <div className="flex-col gap-4">
          <div className="flex-col gap-2">
            {options.map((option, oIndex) => (
              <div 
                key={oIndex} 
                style={{
                  background: selectedAnswer === oIndex ? (option.correct ? '#77CC4F' : '#8d8d8d') : 'transparent',
                  boxShadow: selectedAnswer === oIndex ? (option.correct ? '0 4px 0 #68A82F' : '0 4px 0 #6b6b6b') : 'none',
                }}
                className={`pa-1 w-250px ${selectedAnswer === oIndex ? 'tx-white' : 'border-gg'} bord-r-25 tx-center pointer  `}
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
          <div className="flex-center ">
            <button 
              onClick={onNextQuestion}
              className={`tx-white font-bold py-2 px-4 bord-r-25`}
              style={{
                background: isAnswerCorrect ? '#77CC4F' : '#8d8d8d',
                boxShadow: isAnswerCorrect ? '0 4px 0 #68A82F' : '0 4px 0 #6b6b6b',
              }}
              disabled={!isAnswerCorrect}
            >
              {isLastQuestion ? 'Finish Module' : 'Next Question'}
            </button>
          </div>
          {selectedAnswer !== null && (
            <div className={`tx-center  ${isAnswerCorrect ? 'tx-green' : 'tx-red'}`}>
              {isAnswerCorrect ? 'Correct! 🎉' : 'Incorrect, try again! ❌'}
            </div>
          )}
          {selectedAnswer === null && (
            <div style={{visibility: "hidden"}}>
              waiting for your answer...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 