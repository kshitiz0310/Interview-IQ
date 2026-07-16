import React from 'react'
import { BsRobot } from 'react-icons/bs'

function Footer() {
  return (
    <div className='bg-transparent flex justify-center px-4 pb-10 pt-6'>
      <div className='w-full max-w-6xl glass rounded-[24px] shadow-lg border border-white/10 py-8 px-6 text-center bg-neutral-950/40'>
        <div className='flex justify-center items-center gap-3 mb-4 group cursor-pointer'>
            <div className='bg-zinc-800 text-white p-2 rounded-lg group-hover:bg-brand-500 group-hover:text-neutral-950 transition-all duration-300'><BsRobot size={16}/></div>
            <h2 className='font-bold text-zinc-100 tracking-tight'>
              InterviewIQ<span className="text-brand-300 font-extrabold">.AI</span>
            </h2>
        </div>
        <p className='text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed'>
          Empowering candidates to ace their dream interviews. Our AI-powered preparation platform evaluates and enhances communication skills, technical accuracy, and professional confidence.
        </p>
        <div className="h-px bg-white/10 w-16 mx-auto my-6"></div>
        <p className="text-[11px] text-zinc-500 font-medium">
          &copy; {new Date().getFullYear()} InterviewIQ.AI. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default Footer
