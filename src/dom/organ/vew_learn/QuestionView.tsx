import { useState, useEffect } from 'react';

export type QuestionViewProps = {
  question: string;
  options: { text: string; correct: boolean }[];
  playSoundEffect?: (sound: string) => void;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
  currentQuestionNumber: number;
  totalQuestions: number;
  onCorrectAnswer?: (moduleIndex: number, questionIndex: number, selectedAnswerIndex: number) => void;
  moduleIndex: number;
  questionIndex: number;
  selectedAnswer: number | null;
  isAnswerCorrect: boolean | null;
  onAnswerSelect: (index: number, isCorrect: boolean) => void;
};

export const QuestionView = ({ 
  question, 
  options, 
  playSoundEffect, 
  onNextQuestion, 
  isLastQuestion,
  currentQuestionNumber,
  totalQuestions,
  onCorrectAnswer,
  moduleIndex,
  questionIndex,
  selectedAnswer,
  isAnswerCorrect,
  onAnswerSelect
}: QuestionViewProps) => {
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
            {options.map((option, index) => (
              <div 
                key={index}
                style={{
                  background: selectedAnswer === index ? (option.correct ? '#77CC4F' : '#8d8d8d') : 'transparent',
                  boxShadow: selectedAnswer === index ? (option.correct ? '0 4px 0 #68A82F' : '0 4px 0 #6b6b6b') : 'none',
                }}
                className={`pa-1 w-250px ${selectedAnswer === index ? 'tx-white' : 'border-gg'} bord-r-25 tx-center pointer`}
                onClick={() => {
                  onAnswerSelect(index, option.correct);
                  playSoundEffect?.(option.correct ? "/sfx/short/sssccc.mp3" : "/sfx/short/cling.mp3");
                  if (option.correct && onCorrectAnswer) {
                    onCorrectAnswer(moduleIndex, questionIndex, index);
                  }
                }}
              >
                {option.text}
              </div>
            ))}
          </div>
          <div className="flex-center ">
            <button 
              onClick={onNextQuestion}
              className={`tx-white font-bold py-2 px-4 bord-r-15`}
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