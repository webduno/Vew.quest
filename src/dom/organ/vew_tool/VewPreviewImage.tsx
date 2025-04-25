'use client';




export const VewPreviewImage = ({ selectedTargetInfo, setShowImageModal }: { selectedTargetInfo: any; setShowImageModal: (show: any) => void; }) => {
  return (
    <div className='flex-col px-8  flex-align-center tx-altfont-2 gap-2  bg-white box-shadow-2-b bord-r-15 pa-4'>
      <div className='flex-col w-100'>
        <div onClick={() => {
          setShowImageModal(false);
        }}
          className='opaci-chov--75 tx-bold tx-lg pb-2 '>
          <div className='opaci-25 underline'>Close Target Image</div>
        </div>
      </div>
      <img className='block pos-rel bord-r-15'
        src={`https://webduno.com/vew/image/${selectedTargetInfo?.id.padStart(12, '0')}.jpg`}
        alt={selectedTargetInfo?.description}
        style={{
          overflow: 'hidden',
          width: '100%',
          maxWidth: '300px',
          maxHeight: '300px',
          objectFit: 'contain'
        }} />
      <div className="tx-center tx-altfont-2 mt-2 w-250px"
        style={{
          color: "#4B4B4B",
        }}>
        {selectedTargetInfo?.description}
      </div>
    </div>
  );
};
