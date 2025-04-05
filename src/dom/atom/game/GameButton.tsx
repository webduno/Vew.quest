import Link from "next/link"
import { Tooltip } from 'react-tooltip'
import { ButtonHTMLAttributes } from 'react'

export const GameButton = ({
  children, 
  onClick, 
  buttonType, 
  classOverride, 
  styleOverride, 
  tooltip,
  tooltipId,
  tooltipPlace,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode, 
  buttonType: string, 
  classOverride?: string, 
  styleOverride?: any, 
  tooltip?: string,
  tooltipId?: string,
  tooltipPlace?: string,
}) => {
  return (
    <>
      {/* @ts-ignore */}
      <button
        {...props}
        onClick={onClick}
        type="button"
        data-tooltip-id={tooltipId}
        data-tooltip-content={tooltip}
        data-tooltip-place={tooltipPlace || 'bottom-end'}
        data-tooltip-variant="light"
        className={`game-btn-${buttonType}
            game-btn-base
            pointer
            noborder bord-r-10 pa-1 tx-white tx-shadow-5 tx-altfont-1
            ${classOverride}
        `}
        style={styleOverride}
      >
        {children}
      </button>
      {tooltip && <Tooltip 
      id={tooltipId} 
      place="bottom-start"
      style={{
        zIndex: 10000,
      }}
      />}
    </>
  )
}
