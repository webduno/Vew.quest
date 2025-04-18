"use client";

import { HardBadge } from "@/dom/atom/toast/HardBadge";
import { BewLogo } from "../atom/logo/BewLogo";
import { usePlayerStats } from "@/../script/state/hook/usePlayerStats";
import { KeyboardBtn } from "../atom/button/KeyboardBtn";

export const ConfigPageComponent = () => {
  const { LS_lowGraphics, toggleLowGraphics, LS_ultraGraphics, toggleUltraGraphics } = usePlayerStats();

  return <div className="w-100 flex-col">
  <BewLogo />
    <i className="tx-white tx-altfont-5 tx-xl mt-8 pb-4 opaci-50 tx-shadow-5 tx-ls-5">Config</i>
    <div className="w-100 w-max-500px flex-col pb-8 bord-r-5 pos-rel"
   style={{
    background: "linear-gradient(-45deg, #333333, #777777)",
    boxShadow: "1px 1px 2px #111111, -1px -1px 2px #cccccc",
   }}
   >

<div className="pos-abs top-0 right-0 bord-r-100 z-100 ma-2 noclick box-shadow-2-b" style={{ background: "#aaaaaa", padding: "2px",}} />
<div className="pos-abs top-0 left-0 bord-r-100 z-100 ma-2 noclick box-shadow-2-b" style={{ background: "#aaaaaa", padding: "2px",}} />
<div className="pos-abs bottom-0 right-0 bord-r-100 z-100 ma-2 noclick box-shadow-2-b" style={{ background: "#aaaaaa", padding: "2px",}} />
<div className="pos-abs bottom-0 left-0 bord-r-100 z-100 ma-2 noclick box-shadow-2-b" style={{ background: "#aaaaaa", padding: "2px",}} />

    <div>
      <div className="flex-col">


        <div className="pt-6 pb-2 tx-altfont-5 tx-black opaci-50">Shadows &amp; Graphics</div>
        <div className="flex-wrap w-300px flex-justify-center gap-2  p l-2">
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



        
        <div className="pt-6 pb-2 tx-altfont-5 tx-black opaci-50 mt- ">User Data</div>
        <button className=" pa-4 bord-r-5 opaci-chov--75 pos-rel"
        style={{
          background: "#444444 ",
        }}
        onClick={() => {
          localStorage.clear();
          window.location.href = "/";
        }}
        >
          
<div className="pos-abs top-0 right-0 bord-r-100 z-100 ma-2 noclick box-shadow-2-b" style={{ background: "#666666", padding: "2px",}} />
<div className="pos-abs top-0 left-0 bord-r-100 z-100 ma-2 noclick box-shadow-2-b" style={{ background: "#666666", padding: "2px",}} />
<div className="pos-abs bottom-0 right-0 bord-r-100 z-100 ma-2 noclick box-shadow-2-b" style={{ background: "#666666", padding: "2px",}} />
<div className="pos-abs bottom-0 left-0 bord-r-100 z-100 ma-2 noclick box-shadow-2-b" style={{ background: "#666666", padding: "2px",}} />


        <KeyboardBtn classOverride="tx-altfont-1"
        styleOverride={{
          color: "#ff4444 ",
          transform: "scale(1)",
          background: "linear-gradient(160deg, #5F4E43, #66665A)",
        }}
        >
          Reset User Data <br /> and Settings
        </KeyboardBtn>
        </button>

      </div>
      </div>
      </div>

<div className="flex-col mt-4 pointer tx-white tx-altfont-1">
  <KeyboardBtn onClick={() => {
    window.location.href = "/";
  }}>
    Back to Main Menu
  </KeyboardBtn>
</div>
  </div>;
};
