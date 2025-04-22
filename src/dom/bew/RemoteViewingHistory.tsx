'use client';
import { useState } from 'react';
import { SketchCheck } from './SketchCheck';
import { NotesCheck } from './NotesCheck';

interface RemoteViewingHistoryProps {
  crvObjects: Array<{
    id: string;
    created_at: string;
    content: {
      sent?: Record<string, any>;
      sketch?: any;
      target?: {
        id?: string;
        description?: string;
      };
      target_id?: string;
    };
    result: number;
  }>;
  onSketchClick: (sketch: any, image: {id: string, description: string} | null) => void;
}

export const RemoteViewingHistory = ({ crvObjects, onSketchClick }: RemoteViewingHistoryProps) => {
  return (
    <div className='flex-col flex-align-start gap-2 '>
      <div className='tx-bold tx-lg w-100'>
        <div>
          <div className='tx-bold tx-lg tx-center pt-8 pb-4'
          style={{
            color: "#4b4b4b",
          }}
          >
            Remote Viewing History
          </div>
          <div className='tx-altfont-2 opaci-50 tx-xsm flex-row px-4 '>
            <div className=''>Date</div>
            <div className='flex-1 pl-8'>Report</div>
            <div className=''>Result/Sketch/Notes</div>
          </div>
          <hr className='w-100 opaci-10 '  />
          <div className='flex-col  gap-2 w-100'>
            {crvObjects.map((obj) => (
              <div key={obj.id} className='tx-altfont-2 w-100  flex-row tx-md pb-4 pt-2 pr-4'
              style={{
                borderBottom: "1px solid #e5e5e5",
              }}
              >
                <div className='w-50px tx-bold-2 pl-4 opaci-25'>
                  {obj.created_at.split('T')[0].replaceAll("-","\n")}
                </div>
                <div className='flex-1'>
                  <div className='tx-bold'>
                    <div className='tx-altfont-2  tx-md flex-wrap gap-1 px-3'>
                      {obj.content && obj.content.sent && Object.entries(obj.content.sent).map(([key, value]) => (
                        <div
                        style={{
                          border: "1px solid #e5e5e5",
                          color: "#aaaaaa",
                        }}
                        className='flex-row tx-bold-4 bord-r-10 px-2 py-1 tx-sm  border'
                        key={key}>{key}: {String(value)}</div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex-col">
                  <div className='tx-sm opaci-50'>{obj.result.toFixed(3)}%</div>
                  <div className='tx-lg'>{obj.result > 50 ? '🏆' : '💎'}</div>
                </div>
                <div className=''>
                  <SketchCheck 
                    onClick={() => {
                      onSketchClick(
                        obj.content.sketch,
                        obj.content.target ? {
                          id: obj.content?.target_id || "default",
                          description: obj.content.target.description || ''
                        } : null
                      );
                    }} 
                    content={obj.content} 
                  />
                </div>
                <div className=''><NotesCheck content={obj.content} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 