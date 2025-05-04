'use client';

import { Tooltip } from "react-tooltip";
import { useBackgroundMusic } from "../../../script/state/context/BackgroundMusicContext";

export const IconStatsBar = ({
  potentialStreak, streak, points, hearts, minds
}: { potentialStreak?: number; streak: number; points: number; hearts: number; minds?: number; }) => {
  const { playSoundEffect } = useBackgroundMusic();

  const formatMindCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div className='flex-row pos-rel flex-justify-between tx-altfont-2'>
      <a 
      href={`/tool`}
      className='tx- lg pa-2 pt-4  opaci-chov--50 flex-wrap nodeco'
      // onClick={() => {
      //   playSoundEffect('/sfx/short/passbip.mp3');
      // }}
        data-tooltip-id="streak-tooltip"
        data-tooltip-content="Streak"
        data-tooltip-place="bottom"
        data-tooltip-variant='warning'
      >
        <div className='pos-abs hover-jump'
        style={{
          background: "#ff9900",
          padding: "5px 10px ",
          filter: "blur(10px)",
          
          
        }}
        >

        </div>
        {streak < (potentialStreak || 0) ?
          <div className='tx-lg tx-center '
            style={{
              filter: "grayscale(100%)",
            }}
          >🔥</div>
          :
          <div className='tx-lg tx-center'>🔥</div>}

        <div className='tx-bold-5' style={{ color: "#FFB02E" }}>{streak || potentialStreak}</div>
      </a>
      <a href={`/profile`} className='tx- lg pa-2 pt-4  opaci-chov--50 flex-wrap nodeco'
      // onClick={() => {
      //   playSoundEffect('/sfx/short/passbip.mp3');
      // }}
        data-tooltip-id="points-tooltip"
        data-tooltip-content="Points"
        data-tooltip-place="bottom"
        data-tooltip-variant='info'
      >
        <div className='tx-lg tx-center'>💎</div>
        <div className='tx-bold-5' style={{ color: "#00A6ED" }}>{points}</div>
      </a>
      <a href={`/profile`} className='tx- lg pa-2 pt-4  opaci-chov--50 flex-wrap nodeco'
      // onClick={() => {
      //   playSoundEffect('/sfx/short/passbip.mp3');
      // }}
        data-tooltip-id="hearts-tooltip"
        data-tooltip-content="Average"
        data-tooltip-place="bottom"
        data-tooltip-variant='error'
      >
        <div className='tx-lg tx-center'>❤️</div>
        <div className='tx-bold-5' style={{ color: "#F92F60" }}>{hearts}%</div>
      </a>
{/* 
      <a 
      href={`/learn`}
      className='nodeco pa-2 pt-4  opaci-chov--50 flex-wrap'
      onClick={() => {
        playSoundEffect('/sfx/short/passbip.mp3');
      }}
        data-tooltip-id="minds-tooltip"
        data-tooltip-content="Mind"
        data-tooltip-place="bottom"
        data-tooltip-variant='error'
      >
        <div className='tx-lg tx-center'>🧠</div>
        <div className='tx-bold-5' style={{ color: "#F92F60" }}>{formatMindCount(minds || 0)}</div>
      </a> */}


      <Tooltip id="streak-tooltip" />
          <Tooltip id="points-tooltip" />
          <Tooltip id="hearts-tooltip" />
          <Tooltip id="minds-tooltip" />

    </div>
  );
};
