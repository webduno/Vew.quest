'use client';
import { useState, useEffect } from 'react';
import { useFetchedStats } from '@/script/state/context/FetchedStatsContext';
import { BewWorldLogo } from '../../dom/bew/BewWorldLogo';
import { Tooltip } from 'react-tooltip';
import { clean } from 'profanity-cleaner';
import { LessonCard } from '@/dom/bew/LessonCard';
import { BewPageHeader } from '../../dom/bew/BewPageHeader';

export default function AboutPage() {
  return (
    <>
      <div className='w-100 autoverflow-y h-100vh flex-col flex-justify-start'>
        <div className='flex-row w-100 w-max-1080px tx-altfont-2'>
          <BewWorldLogo />
          <div className='px-4 gap-3 flex-1 flex-row flex-justify-end tx-bold pt-4'>
            
        <a href="/dashboard" className='nodeco' style={{ color: "#AFAFAF" }}>
          <div>Dashboard</div>
        </a>
            <a href="/profile" className='nodeco' style={{ color: "#AFAFAF" }}>
              <div>Profile</div>
            </a>
          </div>
        </div>

<BewPageHeader title={"ABOUT"} />

        <div className='w-100 w-max-1080px flex-col pt-8 gap-4 flex-align-start'>
          <div className='bord-r-15 w-max-700px' >
            {/* <div className='tx-bold tx-lg mb-4 px-4'>The Project</div> */}
            <div className='tx-altfont-2 flex-col'>
              <p className='mb-4 tx-lg px-4'
              style={{
                color: "#777777",
                lineHeight: "1.5",
              }}
              >
                Bew Quest is a gamified remote viewing platform designed to be accessible from any device.
                It combines the precision of scientific methodology with an engaging gaming experience.
                Whether you're a seasoned practitioner or just ready to <a
                style={{
                  color: "#22AEFF",
                }}
                href="/tool">start your journey.</a>
              </p>
              
              <p className='mb-4 tx-sm px-8'>
                Bew provides a seamless and intuitive interface for your remote viewing sessions.                
                The platform will remain free forever with no login requirements while
                committed to accessibility and community growth.
                The platform is <a
                style={{
                  color: "#22AEFF",
                }}
                href="https://github.com/webduno/webbew" target="_blank" rel="noopener noreferrer">open-source</a>, encouraging collaboration and continuous improvement
                from the remote viewing community.
              </p>
            </div>
          </div>

          <div className='bord-r-15  ml-4 py-4' style={{ border: "1px solid #f0f0f0" }}>
            <div className='tx-bold tx-lg mb-4 px-4'>Official Links</div>
            <div className='tx-altfont-2'>
              <p className='mb-4 px-4' >
                Main Website Application: <br /> <a 
                style={{
                  color: "#22AEFF",
                }}
                href="https://bew.quest" target="_blank" rel="noopener noreferrer" className='tx-lgx block py-4 tx-white'>bew.quest</a>
              </p>
            </div>
          </div>

          <hr className='w-100 opaci-20 my-8' />


          <div className='bord-r-15 pb-100'>
            <div className='tx-bold tx-lg mb-4 px-4'>Feedback</div>
            <div className='tx-altfont-2'>
              <p className='mb-4 px-4'>
                If you get some inconsistent results or data that doesn't match, or if an image isn't loading, please let me know so I can fix them as soon as possible. Also, if you have any ideas on how to improve it or what features to add, please leave a comment so I can work on them. I'm trying to make it as useful as possible besides being a gamified tool.
              </p>
            </div>
            <div>
            <div className="flex-wrap gap-2 px-4 flex-align-start flex-justify-start">
    <LessonCard 
  styleOverride={{
    width: "120px"
    
  }}
  actionStyle={{
    width: "80px",
  }}
  title={"Anonymous Feedback"} 
  // question mark emoji
  emoji={"❓"}
  backgroundColor={"#fB404D"} 
  boxShadowColor={"#B52F38"}
  href={"/feedback"} 
  actionText={"Send"}
/>
        <LessonCard 
  actionStyle={{
    width: "80px",
  }}
      styleOverride={{
    width: "120px"
        // width: "300px"
      }}
      title={"Message Developer"} 
      // developer emoji
      emoji={"👨‍💻"}
      href={"https://x.com/webduno"} 
      backgroundColor={"#404DfB"} 
      boxShadowColor={"#2F38B5"}
      actionText={"Contact"}
    />
{/* report issue */}
<LessonCard 
  styleOverride={{
    width: "250px"
  }}
  href={"/feedback"} 
  title={"Report Issue"} 
  emoji={"🐛"}
  backgroundColor={"#40cB4D"} 
  boxShadowColor={"#2F8538"}
  actionText={"Submit"}
/>
            </div>
            </div>
          </div>



          
          <hr className='w-100 opaci-20 my-8' />


          <div className='bord-r-15 '>
            <div className='tx-bold tx-lg mb-4 px-4'>Technical Details</div>
          </div>
          
          <div className='mt -4 px-4'>
            <p className='mb-4 pa-0'>
            Target images are sourced from the Common Objects in Context dataset (<a style={{ color: "#22AEFF" }} href="https://cocodataset.org/" target="_blank" rel="noopener noreferrer" className='tx-white'>cocodataset.org</a>) (COCO-val2017), a comprehensive computer vision dataset. 
            The COCO dataset is one of the most widely-used computer vision datasets, featuring:
            </p>
            <ul className='mb-4 pl-4'>
              <li>80 object categories for precise recognition</li>
              <li>91 stuff categories for environmental context</li>
              <li>5 captions per image for detailed descriptions</li>
              <li>People with keypoints for human pose estimation</li>
            </ul>
            <p className='mb-4'>
              This rich dataset provides an excellent foundation for our target pool, ensuring diverse, well-documented, and high-quality images for remote viewing practice.
            </p>
          </div>

          <div className='bord-r-15 mt-4 px-4 mx-4 py-4' style={{ border: "1px solid #f0f0f0" }}>
            <div className='tx-bold tx-lg mb-4 mt-8'>Processed Target Image List</div>
            <div className='tx-altfont-2'>
              <p className='mb-4'>
                So far, approximately 1,000 images have been carefully selected as targets, with plans to expand the database as we process additional images from the dataset. This curated selection ensures an optimal <a style={{ color: "#22AEFF" }} href="https://en.wikipedia.org/wiki/Not_safe_for_work" target="_blank" rel="noopener noreferrer" className='tx-white'>safe for work</a> experience for both beginners and experienced practitioners.
              </p>
              <p className='mb-4'>
                Each image has been processed to include key properties such as:
              </p>
              <ul className='mb-4'>
                <li>Object type and category</li>
                <li>Natural vs. artificial elements</li>
                <li>Temperature characteristics</li>
                <li>Brightness levels</li>
                <li>Color saturation</li>
                <li>Physical solidity</li>
              </ul>
              <p className='mb-4'>
                We're also developing a custom target creation tool that will allow users to build and share their own target lists. Aswell as requesting of specific targets for the community to solve.
              </p>
            </div>
            <div className='tx-bold tx-lg mb-4'>Techn Stack</div>
            <div className='tx-altfont-2 px-4'>
              <p className='mb-4'>
                - Framework: Nextjs
              </p>
              <p className='mb-4'>
                - Hosting: Vercel
              </p>
              <p className='mb-4'>
                - Database: Supabase
              </p>
              <p className='mb-4'>
                - Third Party UI Libraries: react-tooltip, react-canvas-draw, profanity-cleaner
              </p>
              <p className='mb-4'>
                - 3D Ecosystem: react-three/fiber, @react-three/drei, @react-three/cannon
              </p>
              <p className='mb-4'>
                - IDE: Cursor
              </p>
            </div>
          </div>
          <div className='bord-r-15 mb-100 mx-4' style={{ border: "1px solid #f0f0f0" }}>
            <div className='tx-bold tx-lg mb-4 px-8 pt-8 py-4'>Roadmap</div>
            <div className='tx-altfont-2 pb-4'>
              <div className='px-4'>
                <div className='tx-bold mb-2 pl-2 opaci-50'>Short-term Goals</div>
                <ul>
                  <li className='ma-0'>
                    <p>
                      Expand target database with more diverse images from COCO dataset
                    </p>
                  </li>
                  <li className='ma-0'>
                    <p>
                      Create mobile-optimized experience for better on-the-go usage
                    </p>
                  </li>
                </ul>
              </div>

              <div className='px-4 mt-4'>
                <div className='tx-bold mb-2 pl-2 opaci-50'>Mid-term Goals</div>
                <ul>
                  <li className='ma-0'>
                    <p>
                      Add advanced analytics and progress tracking features
                    </p>
                  </li>
                  <li className='ma-0'>
                    <p>
                      Develop training modules for beginners
                    </p>
                  </li>
                </ul>
              </div>

              <div className='px-4 mt-4'>
                <div className='tx-bold mb-2 pl-2 opaci-50'>Long-term Goals</div>
                <ul>
                  <li className='ma-0'>
                    <p>
                      Implement collaborative remote viewing sessions
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>








        </div>
      </div>
    </>
  );
} 



