"use client";

import { HardBadge } from "@/../scripts/contexts/HardBadge";
import { BewLogo } from "../atom/BewLogo";

export const ConfigPageComponent = () => {
  return <div className="w-100 flex-col">
<BewLogo />
    <i className="tx-white tx-altfont-5 tx-xl mt-8 opaci-25 tx-ls-5">Config</i>
    <div>
      <div>
        {/* <button className="tx-red tx-center opaci-chov--50 bord-r-5 border-red mt-100" 
        onClick={() => {
          localStorage.clear();
          window.location.href = "/";
        }}
        >Reset User Data <br /> and Settings</button> */}
        <button className=" mt-8 pa-4 bord-r-5 opaci-chov--75"
        style={{
          background: "#444444 ",
        }}
        onClick={() => {
          localStorage.clear();
          window.location.href = "/";
        }}
        >
        <HardBadge>
          Reset <br /> User Data <br /> and Settings
        </HardBadge>
        </button>
      </div>
    </div>
  </div>;
};
