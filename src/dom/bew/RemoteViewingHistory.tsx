'use client';
import { useState } from 'react';
import { SketchCheck } from './SketchCheck';
import { NotesCheck } from './NotesCheck';
import CanvasDraw from 'react-canvas-draw';

interface RemoteViewingHistoryProps {
  authorId: string;
  crvObjects: Array<{
    id: string;
    created_at: string;
    content: {
      sent?: Record<string, any>;
      sketch?: any;
      notes?: string;
      target?: {
        id?: string;
        description?: string;
      };
      target_id?: string;
    };
    result: number;
  }>;
  onSketchClick: (sketch: any, image: {id: string, description: string} | null) => void;
  highlightTarget?: string;
}

export const RemoteViewingHistory = ({ authorId, crvObjects, onSketchClick, highlightTarget = '' }: RemoteViewingHistoryProps) => {
  const [modalView, setModalView] = useState<'sketch' | 'image' | 'notes'>('sketch');
  const [showModal, setShowModal] = useState(false);
  const [currentSketch, setCurrentSketch] = useState<any>(null);
  const [currentImage, setCurrentImage] = useState<{id: string, description: string} | null>(null);
  const [currentNotes, setCurrentNotes] = useState<string | null>(null);

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
          <div className='flex-col  gap-2 w-90 '
          style={{
            marginLeft: "5%",
          }}
          >
            {crvObjects.map((obj) => (
              <div key={obj.id}
              id={`target-${obj.content.target_id}`}
              className={`tx-altfont-2 w-100  flex-row tx-md pb-4 pt-2 pr-4 ${highlightTarget === obj.content.target_id ? 'bg-blue-100' : ''}`}
              style={{
                borderBottom: "1px solid #e5e5e5",
                backgroundColor: highlightTarget.replace("target-", "") === obj.content.target_id ? '#fff7f0' : 'transparent',
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
                        className='flex-row tx-bold-4 bord-r-10 px-2 py-1 tx-xsm  border'
                        key={key}>{key}: {key=="type"?value:parseInt(String(value))}</div>
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
                      setCurrentSketch(obj.content.sketch);
                      setCurrentImage(obj.content.target ? {
                        id: obj.content?.target_id || "default",
                        description: obj.content.target.description || ''
                      } : null);
                      setCurrentNotes(obj.content.notes || null);
                      setShowModal(true);
                      setModalView(obj.content.sketch ? 'sketch' : 'image');
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

      {showModal && (currentSketch || currentImage || currentNotes) && (
        <div className='pos-abs flex-col top-0 left-0 w-100 h-100 bg-glass-10 z-200'>
          <div className='flex-col px-8 flex-align-center tx-altfont-2 gap-2 bg-white box-shadow-2-b bord-r-15 pa-4'>
            <div className='flex-col w-100'>
              <div onClick={() => {
                setShowModal(false);
                setCurrentSketch(null);
                setCurrentImage(null);
                setCurrentNotes(null);
                setModalView('sketch');
              }}
              className='opaci-chov--75 tx-bold tx-lg pb-2'>
                <div className='opaci-25 '>Close Target Report</div>
              </div>
              <div className='tx-sm opaci-50 pointer underline'
              style={{
                
              }}
              onClick={() => {
                navigator.clipboard.writeText(window.location.origin + `/u?friend=${authorId}#target-${currentImage?.id}`);
                alert('Viewing Url Copied to Clipboard\n\n/u?friend=' + authorId + '&target=' + currentImage?.id);
              }}
              >
                {/* link emoji */}
                🔗Copy Viewing Url
              </div>
            </div>
            
            <div className='flex-row gap-2 w-100'>
              <button 
                className={`tx-sm bg-trans noborder px-2 pa-0 pointer tx-altfont-2 underline px-1 ${modalView === 'sketch' ? 'opaci-100' : 'opaci-50'}`}
                onClick={() => setModalView('sketch')}
              >
                <div>Drawing</div>
              </button>
              <button 
                className={`tx-sm bg-trans noborder px-2 pa-0 pointer tx-altfont-2 underline px-1 ${modalView === 'image' ? 'opaci-100' : 'opaci-50'}`}
                onClick={() => setModalView('image')}
              >
                <div>Image</div>
              </button>
              <button 
                className={`tx-sm bg-trans px-2 noborder pa-0 pointer tx-altfont-2 underline px-1 ${modalView === 'notes' ? 'opaci-100' : 'opaci-50'}`}
                onClick={() => setModalView('notes')}
              >
                <div>Notes</div>
              </button>
            </div>

            <div className='bord-r-15 flex-col'
              style={{
                minHeight: "300px",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {modalView === 'sketch' && (
                currentSketch ? (
                  <CanvasDraw
                    disabled
                    hideGrid
                    canvasWidth={300}
                    canvasHeight={300}
                    saveData={currentSketch}
                    style={{
                      borderRadius: "15px",
                    }}
                  />
                ) : (
                  <div className="tx-center tx-altfont-2 opaci-50">Drawing not available</div>
                )
              )}
              {modalView === 'image' && currentImage && (
                <img className='block pos-rel'
                  src={`https://webduno.com/vew/image/${currentImage.id == "default" ? "default" : currentImage.id.padStart(12, '0')}.jpg`}
                  alt={currentImage.description}
                  style={{
                    overflow: 'hidden',
                    borderRadius: "15px",
                    border: "1px solid #e5e5e5",
                    width: '100%',
                    maxWidth: '300px',
                    maxHeight: '300px',
                    objectFit: 'contain'
                  }}
                />
              )}
              {modalView === 'notes' && (
                <div className='w-100 h-100 pa-4 bord-r-15'
                  style={{
                    border: "1px solid #e5e5e5",
                    maxWidth: '200px',
                    minHeight: '200px',
                    overflowY: 'auto'
                  }}
                >
                  {currentNotes ? (
                    <div className="tx-altfont-2 whitespace-pre-wrap">{currentNotes}</div>
                  ) : (
                    <div className="tx-center tx-altfont-2 opaci-50">Notes not available</div>
                  )}
                </div>
              )}
            </div>
            <div className="tx-center tx-altfont-2 mt-2 w-250px"
              style={{
                color: "#4B4B4B",
              }}
            >
              {modalView === 'sketch' ? (currentSketch ? 'Your Drawing' : '') : 
               modalView === 'image' ? currentImage?.description : 
               currentNotes ? 'Your Notes' : ''}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 