import { BewChoiceButton } from '@/dom/bew/BewChoiceButton';
import { useProfileSnackbar } from '@/script/state/context/useProfileSnackbar';
import React from 'react';

interface ModuleListProps {
  coursingData: any;
  handleModuleClick: (index: number) => void;
}

export const ModuleList: React.FC<ModuleListProps> = ({ coursingData, handleModuleClick }) => {
  const { triggerSnackbar } = useProfileSnackbar();
  const isModuleEnabled = (currentIndex: number): boolean => {
    try {
      const progress = JSON.parse(coursingData.progress || '[]');
      
      // First module is always enabled
      if (currentIndex === 0) return true;
      
      // Check if all previous modules are complete
      for (let i = 0; i < currentIndex; i++) {
        const moduleProgress = progress[i]?.en || [];
        const moduleContent = JSON.parse(coursingData.content)[i]?.en || {};
        const itemsInModule = Object.keys(moduleContent).length;
        
        // If any previous module is not complete, return false
        if (moduleProgress.length !== itemsInModule || !moduleProgress.every((q: any) => q?.answered)) {
          return false;
        }
      }
      
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <div className="flex-col gap-8 mt-8">
      {JSON.parse(coursingData.content).map((section: any, index: number) => {
        const itemsInArray = Object.keys(section?.["en"]).length;
        const steps = Array.from({ length: itemsInArray }, (_, i) => Math.sin(i * 0.1) * 100);
        const xOffset = steps[index % steps.length];
        const enabled = isModuleEnabled(index);
        
        return (
          <button 
            key={index}
            onClick={() => {
              if (!enabled) {
              // alert("Please complete all previous modules to start this lesson")
              triggerSnackbar(<>
              <div className='w-200px tx-center tx-mdl'>Please complete all previous modules to start this lesson</div>
              </>, "error")
              return
             }
             handleModuleClick(index)
            }
            }
            className={`border-gg bord-r-25 w-150px px-4 pt-3 pb-4 gap-2 flex-col  ${enabled ? ' pointer ' : ' opaci-25'}`}
            style={{
              transform: `translateX(${xOffset}%)`,
              transition: 'transform 0.3s ease-in-out',
              borderColor: (() => {
                try {
                  const progress = JSON.parse(coursingData.progress || '[]');
                  const moduleProgress = progress[index]?.en || [];
                  const hasProgress = moduleProgress.some((q: any) => q?.answered);
                  const isComplete = moduleProgress.length === itemsInArray && 
                                   moduleProgress.every((q: any) => q?.answered);
                  
                  if (isComplete) return '#7DDB80';
                  if (hasProgress) return '#ffeecc';
                } catch (e) {}
                return '';
              })()
            }}
          >
            
          <BewChoiceButton
            // secondaryColor="#D07900"
            // mainColor="#FF9600"
            
            secondaryColor="#68A82F"
            mainColor="#77CC4F"
            onClick={() => {
              // playSoundEffect("/sfx/short/passbip.mp3")
              // handleInputTypeChange('multi-options')
            }}
            text="Start Lesson"
            image={<div>⭐</div>}
          />
            <div className="font-bold tx-center tx-lg">Module {index + 1}</div>
            <div className="tx-center opaci-50">{section.en[0].question}</div>
          </button>
        );
      })}
    </div>
  );
}; 