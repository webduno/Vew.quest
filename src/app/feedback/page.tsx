'use client';
import { useState, useEffect } from 'react';
import { useFetchedStats } from '@/script/state/context/FetchedStatsContext';
import { BewWorldLogo } from '../../dom/bew/BewWorldLogo';
import { Tooltip } from 'react-tooltip';
import { clean } from 'profanity-cleaner';
import { LessonCard } from '@/dom/bew/LessonCard';

export default function AboutPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSendFeedback = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Please fill in both title and content fields');
      return;
    }
    const playerId = localStorage.getItem('VB_PLAYER_ID');
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/supabase/dev_issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          player_id: playerId,
          title: clean(title.trim()),
          content: clean(content.trim())
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setSubmitStatus('success');
        setTitle('');
        setContent('');
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 3000);
      } else {
        setSubmitStatus('error');
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 3000);
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
      setSubmitStatus('error');
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className='w-100 autoverflow-y h-100vh flex-col flex-justify-start'>
        <div className='flex-row w-100 w-max-1080px tx-altfont-2'>
          <BewWorldLogo />
          <div className='px-4 gap-3 flex-1 flex-row flex-justify-end tx-bold pt-4'>
            
          <a href="/profile" className='nodeco' style={{ color: "#AFAFAF" }}>
              <div>Profile</div>
            </a>
            <a href="/dashboard" className='nodeco' style={{ color: "#AFAFAF" }}>
              <div>Dashboard</div>
            </a>
          </div>
        </div>

        <div>
          <div className='tx-lg tx-altfont-2 tx-bold opaci-25 tx-ls-1'>FEEDBACK</div>
        </div>

        <div className='w-100 w-max-1080px flex-col pt-8 gap-4 flex-align-start'>
          

          <div className='tx-altfont-2 bord-r-15  py-4' style={{ border: "1px solid #f0f0f0" }}>
            <div className='tx-bold tx-lg mb-4 px-4'
            style={{
              color: "#AFAFAF",
            }}
            >Message Title</div>
            <div className='tx-altfont-2 px-4'>
              <input type="text" className=' bord-r-15 px-4 py-2 tx-lg  tx-altfont-2'
              placeholder='Feedback Subject'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                border: "1px solid #f0f0f0",
              }}
               />
            </div>

          </div>

          <div className='w-100 flex-col flex-align-stretch'>
              <textarea className=' bord-r-15 px-4 py-2 tx-lg  tx-altfont-2'
              placeholder='Feedback Message'
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              style={{
                border: "1px solid #f0f0f0",
              }}
              />
            </div>
            <div className='tx-center mb-  w-100 flex-col  '
            style={{
              alignContent: "stretch",
            }}
            
            >
            <div 
            onClick={handleSendFeedback}
             className={`nodeco bord-r-25 py-4 tx-altfont-2 tx-bold-4 w-100 tx-bold block tx-center ${isSubmitting ? 'opaci-50' : ''}`}
            style={{
              color: submitStatus === 'success' ? "#22cc22" : submitStatus === 'error' ? "#cc2222" : "#ff9900",
              background: submitStatus === 'success' ? "#e5ffe5" : submitStatus === 'error' ? "#ffe5e5" : "#FAeFa5",
              boxShadow: `0px 4px 0 0px ${submitStatus === 'success' ? "#22aa22" : submitStatus === 'error' ? "#aa2222" : "#F7CB28"}`,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
            }}
            >
              {isSubmitting ? 'Sending...' : submitStatus === 'success' ? 'Sent Successfully!' : submitStatus === 'error' ? 'Error Sending' : 'Send Feedback'}
            </div>
            </div> 


          <hr className='w-100 opaci-20 my-8' />

          <div className='bord-r-15 mb-100 ' style={{ border: "1px solid #f0f0f0" }}>
            <div className='tx-bold tx-lg mb-4 px-8 pt-8 py-4'>Frequently Asked Questions (FAQ)</div>
            <div className='tx-altfont-2 pb-4'>
              <div className='px-4'>
                <div className='tx-bold mb-2 pl-2 opaci-50'>General Questions</div>
                <ul>
                  <li className='ma-0'>
                    <p className='tx-bold'>What is BewWorld?</p>
                    <p className='opaci-75'>BewWorld is an interactive learning platform designed to help users improve their visual recognition and cognitive skills through engaging <a href="/tools" className='nodeco' style={{ color: "#22AEFF" }}>exercises</a> and challenges.</p>
                  </li>
                  <li className='ma-0 mt-4'>
                    <p className='tx-bold'>How do I get started?</p>
                    <p className='opaci-75'>Simply create an account and head to the <a href="/dashboard" className='nodeco' style={{ color: "#22AEFF" }}>dashboard</a>. From there, you can access various learning modules and start your journey.</p>
                  </li>
                </ul>
              </div>

              <div className='px-4 mt-4'>
                <div className='tx-bold mb-2 pl-2 opaci-50'>Account & Progress</div>
                <ul>
                  <li className='ma-0'>
                    <p className='tx-bold'>How do I track my progress?</p>
                    <p className='opaci-75'>Your progress is automatically tracked and displayed in your <a href="/dashboard" className='nodeco' style={{ color: "#22AEFF" }}>dashboard</a>. You can view your <a href="/profile" className='nodeco' style={{ color: "#22AEFF" }}>achievements</a>, completed lessons, and overall performance metrics.</p>
                  </li>
                </ul>
              </div>

              <div className='px-4 mt-4'>
                <div className='tx-bold mb-2 pl-2 opaci-50'>Support & Feedback</div>
                <ul>
                  <li className='ma-0'>
                    <p className='tx-bold'>How can I report an issue?</p>
                    <p className='opaci-75'>You can use the feedback form above to report any issues or bugs you encounter. We&apos;ll review your submission and get back to you as soon as possible.</p>
                  </li>
                  <li className='ma-0 mt-4'>
                    <p className='tx-bold'>Where can I get additional support?</p>
                    <p className='opaci-75'>For additional support, you can reach out to the main developer on <a href="https://x.com/webduno" target='_blank' rel='noopener noreferrer' className='nodeco' style={{ color: "#22AEFF" }}>𝕏 (@webduno)</a> or use the feedback form above.</p>
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

