export const BewBtn = ({text, onClick, disabled, ...args}: {text: any, onClick: () => void, disabled?: boolean} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (<>
    <button 
              className={'py-2 px-8 tx-center tx-bold tx-white bord-r-15 tx-lgx ' + (disabled ? 'opaci-50' : 'opaci-chov--75') + ' ' + args.className}
              onClick={onClick}
              disabled={disabled}
              style={args.style || {
                backgroundColor: "#aaaaaa",
                boxShadow: "0px 4px 0 0px #666666",
                cursor: disabled ? 'not-allowed' : 'pointer',
              }}
            >
              {text}
            </button>
  </>)
}
export const BewOrangeBtn = ({text, onClick, disabled, ...args}: {text: any, onClick: () => void, disabled?: boolean} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (<>
    <BewBtn text={text} onClick={onClick} disabled={disabled} {...args} 
    style={{
      backgroundColor: "#ff9500",
      boxShadow: "0px 4px 0 0px #aa5500",
      cursor: disabled ? 'not-allowed' : 'pointer',
    }}
    />
    </>)
}
export const BewGreenBtn = ({text, onClick, disabled, ...args}: {text: any, onClick: () => void, disabled?: boolean} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (<>
    <BewBtn text={text} onClick={onClick} disabled={disabled} {...args} 
    style={{
      backgroundColor: "#77CC4F",
      boxShadow: "0px 4px 0 0px #68A82F",
      cursor: disabled ? 'not-allowed' : 'pointer',
    }}
    />
    </>)
}
export const BewPurpleBtn = ({text, onClick, disabled, ...args}: {text: any, onClick: () => void, disabled?: boolean} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (<>
    <BewBtn text={text} onClick={onClick} disabled={disabled} {...args} 
    style={{
      backgroundColor: "#807DDB",
      boxShadow: "0px 4px 0 0px #6B69CF",
      cursor: disabled ? 'not-allowed' : 'pointer',
    }}
    />
    </>)
}


