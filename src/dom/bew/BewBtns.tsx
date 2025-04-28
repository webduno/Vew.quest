
export const BewBtn = ({text, onClick, ...args}: {text: string, onClick: () => void} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (<>
    <button 
              className={'py-2 px-8 tx-center tx-bold tx-white bord-r-15 tx-lgx opaci-chov--75' + args.className}
              onClick={onClick}
              style={args.style || {
                backgroundColor: "#aaaaaa",
                boxShadow: "0px 4px 0 0px #666666",
              }}
            >
              {text}
            </button>
  </>)
}
export const BewOrangeBtn = ({text, onClick, ...args}: {text: string, onClick: () => void} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (<>
    <BewBtn text={text} onClick={onClick} {...args} 
    style={{
      backgroundColor: "#ff9500",
      boxShadow: "0px 4px 0 0px #aa5500",
    }}
    />
    </>)
}
export const BewPurpleBtn = ({text, onClick, ...args}: {text: string, onClick: () => void} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (<>
    <BewBtn text={text} onClick={onClick} {...args} 
    style={{
      backgroundColor: "#807DDB",
      boxShadow: "0px 4px 0 0px #6B69CF",
    }}
    />
    </>)
}


