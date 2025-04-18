


export const KeyboardBtn = ({ children, onClick, classOverride, styleOverride }: { children: React.ReactNode; onClick?: () => void; classOverride?: string; styleOverride?: React.CSSProperties }) => {
  return <div className={"px-5 py-1 pb-3 bord-r-5 key-btn "+ classOverride}
  onClick={onClick}
  style={styleOverride}
  >
    {children}
  </div>;
};
