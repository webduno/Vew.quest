


export const BewMenuButton = ({ children, onClick, classOverride }: { children: React.ReactNode; onClick?: () => void; classOverride?: string }) => {
  return <div className={"px-5 py-1 pb-3 bord-r-5 key-btn "+ classOverride}
  onClick={onClick}
  >
    {children}
  </div>;
};
