'use client';


export const BewPageHeader = ({ title }: { title: string; }) => {
  return (<>
    <div className='Q_xs_sm py-8'></div>
    <div>
      <div className='tx-lg tx-altfont-2 tx-bold opaci-25 tx-ls-1'>{title}</div>
    </div>
  </>
  );
};
