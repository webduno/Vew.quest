import React from 'react';

interface ModuleListProps {
  coursingData: any;
  handleModuleClick: (index: number) => void;
}

export const ModuleList: React.FC<ModuleListProps> = ({ coursingData, handleModuleClick }) => {
  return (
    <div className="flex-col gap-4 mt-8">
      {JSON.parse(coursingData.content).map((section: any, index: number) => {
        const itemsInArray = Object.keys(section?.["en"]).length;
        const steps = Array.from({ length: itemsInArray }, (_, i) => Math.sin(i * 0.1) * 100);
        const xOffset = steps[index % steps.length];
        return (
          <div 
            key={index}
            onClick={() => handleModuleClick(index)}
            className='border-gg bord-r-25 tx-lg w-150px cursor-pointer px-4 pt-3 pb-4 gap-2 flex-col pointer'
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
            <div className="font-bold tx-center">Module {index + 1}</div>
            <div className="tx-center opaci-50">{section.en[0].question}</div>
          </div>
        );
      })}
    </div>
  );
}; 