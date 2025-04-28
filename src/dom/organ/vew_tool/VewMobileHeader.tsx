import { WrappedBewUserStatsSummary } from "@/dom/organ/vew_tool/BewUserStatsSummary";
import { Tooltip } from "react-tooltip";

export const VewMobileHeader = () => {
  return (
    <div className='Q_xs flex-row px-4'>
                   <WrappedBewUserStatsSummary  minified={true} />
                   <div className='flex-1 flex-col flex-align-end '>
                      <a href="/profile" className='nodeco tx-lg bord-r-100 hover-jump bord-r-100 pointer noverflow block pa-1 pt-3'
                      
                      >
                        <img src="/bew/pfp/row-4-column-1.png" alt="profile" width="36px bord-r-100 pointer noverflow block" />
                      </a>
                   </div>
                </div>
  );
};

