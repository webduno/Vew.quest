'use client';
import { Tooltip } from 'react-tooltip';
import { useFetchedStats } from '@/script/state/context/FetchedStatsContext';
import { useState, useEffect } from 'react';
import { IconStatsBar } from './IconStatsBar';

export const BewUserStatsSummary = ({
  minified = false
}: {
  minified?: boolean;
}) => {
  const [LS_playerId, setLS_playerId] = useState<string | null>(null);
  const { potentialStreak,
    streak, dailyProgress, dailyGoal, isLoading, error, crvObjects, averageResult } = useFetchedStats();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLS_playerId(localStorage.getItem('VB_PLAYER_ID'));
    }
  }, []);

  if (isLoading) {
    return <div 
    style={{
      color: "#cccccc",
    }}
    className='py-2 tx-ls-3'>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (minified) {
    return (
      <IconStatsBar potentialStreak={potentialStreak}  streak={streak}
      points={crvObjects.length}
      hearts={Math.round(averageResult)}
      />
    );
  }

  return (<>
    <IconStatsBar potentialStreak={potentialStreak}  streak={streak}
    points={crvObjects.length}
    hearts={Math.round(averageResult)}
    />

    <div className='flex-col flex-align-stretch gap-4'>
      <div className='bord-r-10 pa-4 pl-2' 
      style={{
        border: "1px solid #E5E5E5",
      }}
      >
        <div className='flex-row flex-justify-start gap-2'>
          <div>
            <div className='tx-lgx'>✨</div>
          </div>
          <div className='flex-col flex-align-start gap-2 flex-1'>
            <div className='tx-bold'
            style={{
              color: "#4B4B4B",
            }}
            >Daily Goal</div>
            <div className='tx-sm tx-bold bord-r-25  w-100 ' style={{
              padding: "3px 0",
              boxShadow: "0 2px 0 #D68800",
              background: "#FDC908",
              color: "#D68800",
            }}>
              <div className='flex-row gap-1'>
                <div>{dailyProgress}/{dailyGoal}</div>
                <div>Targets</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <a href="/profile" className='nodeco'>
            <div className='py-2 mt-4 tx-center tx-white bord-r-10  opaci-chov--75'
            data-tooltip-id="view-profile-tooltip"
            data-tooltip-content={`${LS_playerId}`}
            data-tooltip-place="bottom"
            style={{
              backgroundColor: "#807DDB",
              boxShadow: "0px 4px 0 0px #6B69CF",
            }}
            >View Profile</div>
          </a>
          <Tooltip id="view-profile-tooltip" />
          <Tooltip id="home-tooltip" />
          <Tooltip id="lessons-tooltip" />
          <Tooltip id="goals-tooltip" />
          <Tooltip id="profile-tooltip" />
          <Tooltip id="settings-tooltip" />
          <Tooltip id="help-tooltip" />
          <Tooltip id="streak-tooltip" />
          <Tooltip id="points-tooltip" />
          <Tooltip id="hearts-tooltip" />
        </div>
      </div>

      <a target='_blank'
      href="https://www.reddit.com/r/remoteviewing/comments/1k1y0ge/weekly_practice_objective_r16487/"
      className='bord-r-10 pa-4 pl-2 opaci-chov--75 nodeco' 
      style={{
        border: "1px solid #E5E5E5",
      }}
      >
        <div className='flex-row flex-justify-start gap-2'>
          <div>
            <div className='tx-lgx'>📅</div>
          </div>
          <div className='flex-col flex-align-start gap-2'>
            <div className='tx-bold'
            style={{
              color: "#4B4B4B",
            }}
            >Weekly Goal</div>
            <div className='tx-sm ' style={{color: "#afafaf"}}>
              <div className='flex-col gap-1'>
                <div>Reddit&apos;s Practice Object</div>
              </div>
            </div>
          </div>
        </div>
        <div></div>
      </a>

      <div className='bord-r-10' 
      style={{
        border: "1px solid #E5E5E5",
      }}
      >
        <div className='flex-row  tx-smd flex-justify-between pt-4 pb-2 gap-2'>
          <div className='tx-bold px-4' 
          style={{
            color: "#4B4B4B",
          }}
          >Resources</div>
          <a 
          className='tx-bold px-4 pointer nodeco' 
          href="/dashboard#resources"
          style={{
            color: "#22AEFF",
          }}
          >View All</a>
        </div>

        <a 
        href="https://www.reddit.com/r/remoteviewing/comments/184cl9k/start_here_introduction_faq_resources_welcome_to/"
        target='_blank'
        className='flex-row flex-align-start nodeco flex-justify-start pa-2 opaci-chov--75 gap-2'>
          <div className=''>
            <div className='tx-lgx'>
            📖
            </div>
          </div>
          <div className='flex-col flex-align-start gap-2'>
            <div className='tx-bold pt-2'
            style={{
              color: "#4B4B4B",
            }}
            >Fundamentals</div>
            <div className='tx-sm flex-col flex-align-start gap-1' style={{color: "#afafaf"}}>
              <div className='flex-row gap-1 tx-xsm'>
                <div>- Sensory perception training</div>
              </div>
              <div className='flex-row gap-1 tx-xsm'>
                <div>- Target recognition</div>
              </div>
            </div>
          </div>
        </a>

        <a
        href="https://www.reddit.com/r/AstralProjection/comments/n34zh5/astral_projection_quick_start_guide/"
        target='_blank'
        className='flex-row flex-align-start nodeco flex-justify-start pa-2 opaci-chov--75 gap-2'>
          <div className=''>
            <div className='tx-lgx'>🌳</div>
          </div>
          <div className='flex-col flex-align-start gap-2'>
            <div className='tx-bold pt-2'
            style={{
              color: "#4B4B4B",
            }}
            >Astral Projection</div>
            <div className='tx-sm flex-col flex-align-start gap-1' style={{color: "#afafaf"}}>
              <div className='flex-row gap-1 tx-xsm'>
                <div>- Meditation &amp; visualization</div>
              </div>
              <div className='flex-row gap-1 tx-xsm'>
                <div>- Coordinate remote viewing</div>
              </div>
            </div>
          </div>
        </a>

        <a 
        href="https://chain.link/vrf"
        target='_blank'
        className='flex-row flex-align-start nodeco pb-4 flex-justify-start pa-2 opaci-chov--75 gap-2'>
          <div className=''>
            <div className='tx-lgx'>🎱</div>
          </div>
          <div className='flex-col flex-align-start gap-2'>
            <div className='tx-bold pt-2'
            style={{
              color: "#4B4B4B",
            }}
            >RNG Basics</div>
            <div className='tx-sm flex-col flex-align-start gap-1' style={{color: "#afafaf"}}>
              <div className='flex-row gap-1 tx-xsm'>
                <div>- Random number generator</div>
              </div>
            </div>
          </div>
        </a>

        <div></div>
      </div>
    </div>
  </>);
};

