'use client';


export const BewPageHeader = ({ title, isBigScreenOnly = false }: { title: string; isBigScreenOnly?: boolean }) => {
  return (<>
    {!isBigScreenOnly && <div className='Q_xs_sm py-8'></div>}
    <div>
      <div className={
        'tx-lg tx-altfont-2 tx-bold opaci-25 tx-ls-1 '+ (isBigScreenOnly ? 'Q_md_x' : '')
      }>{title}</div>
    </div>
  </>
  );
};
