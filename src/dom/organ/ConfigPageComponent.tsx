"use client";

import { HardBadge } from "@/dom/atom/toast/HardBadge";
import { BewLogo } from "../atom/logo/BewLogo";
import { usePlayerStats } from "@/../script/state/hook/usePlayerStats";

export const ConfigPageComponent = () => {
  const { LS_lowGraphics, toggleLowGraphics, LS_ultraGraphics, toggleUltraGraphics } = usePlayerStats();

  return <div className="w-100 flex-col">
    <BewLogo />
    <i className="tx-white tx-altfont-5 tx-xl mt-8 opaci-25 tx-ls-5">Config</i>
    <div>
      <div className="flex-col">
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

        <div className="flex-wrap w-300px flex-justify-center gap-2 pt-4 p l-2">
          <div className="flex-row bord-r-5" style={{
            background: "#262320",
            boxShadow: "1px 1px 1px #111111, -1px -1px 1px #777777",
          }}>
            <input id="vb_legacy_graphics"
              className="pointer ml-2"
              style={{transform: "scale(1.5)", filter: "invert(1)"}} 
              type="checkbox" 
              checked={!LS_lowGraphics}
              onChange={toggleLowGraphics}
            />
            <label
              htmlFor="vb_legacy_graphics"
              className="tx-white opaci-50 pa-2 pointer tx-altfont-1">HD</label>
          </div>
          <div className="flex-row bord-r-5" style={{
            background: "#262320",
            boxShadow: "1px 1px 1px #111111, -1px -1px 1px #777777",
          }}>
            <input id="vb_ultra_graphics"
              className="pointer ml-2"
              style={{transform: "scale(1.5)", filter: "invert(1)"}} 
              type="checkbox" 
              checked={LS_ultraGraphics}
              onChange={toggleUltraGraphics}
            />
            <label
              htmlFor="vb_ultra_graphics"
              className="tx-white opaci-50 pa-2 pointer tx-altfont-5 tx-lx">4K</label>
          </div>
        </div>
      </div>
    </div>
  </div>;
};
