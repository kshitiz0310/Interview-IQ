import React from 'react'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'
import { motion } from "motion/react";
import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFileEarmarkText
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthModel from '../components/AuthModel';
import hrImg from "../assets/HR.png";
import techImg from "../assets/tech.png";
import confidenceImg from "../assets/confi.png";
import creditImg from "../assets/credit.png";
import evalImg from "../assets/ai-ans.png";
import resumeImg from "../assets/resume.png";
import pdfImg from "../assets/pdf.png";
import analyticsImg from "../assets/history.png";
import Footer from '../components/Footer';

function Home() {
  const { userData } = useSelector((state) => state.user)
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate()
  const Motion = motion

  return (
    <div className='min-h-screen bg-[#030307] text-zinc-100 bg-grid-pattern flex flex-col relative overflow-hidden'>
      {/* Background ambient glows */}
      <div className="absolute top-[-10%] left-[-15%] w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-emerald-500/12 to-indigo-500/15 blur-[160px] pointer-events-none"></div>
      <div className="absolute top-[30%] right-[-15%] w-[700px] h-[700px] rounded-full bg-gradient-to-bl from-indigo-500/15 to-cyan-500/12 blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-emerald-500/10 to-teal-500/12 blur-[140px] pointer-events-none"></div>
      
      <Navbar />

      <div className='flex-1 px-4 sm:px-6 py-16 md:py-24 relative z-10'>
        <div className='max-w-6xl mx-auto'>

          {/* Badge */}
          <div className='flex justify-center mb-8'>
            <Motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className='glass text-emerald-300 text-xs sm:text-sm px-5 py-2 rounded-full flex items-center gap-2 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.15)] bg-emerald-950/20 backdrop-blur-md font-semibold tracking-wide'
            >
              <HiSparkles size={14} className="text-emerald-400 font-bold animate-pulse" />
              <span>AI-Powered Interview Coach</span>
            </Motion.div>
          </div>

          {/* Hero Content */}
          <div className='text-center mb-24 md:mb-32'>
            <Motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='text-4xl sm:text-5xl md:text-7xl font-black leading-[1.1] max-w-5xl mx-auto tracking-tighter text-white'>
              Practice Mock Interviews with{" "}
              <span className='bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent block sm:inline mt-2 sm:mt-0'>
                Real AI Intelligence
              </span>
            </Motion.h1>

            <Motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className='text-slate-400 mt-6 max-w-2xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed'>
              Role-based technical & behavioral simulations featuring smart follow-ups, adaptive difficulty, and instant performance metrics.
            </Motion.p>

            <div className='flex flex-col sm:flex-row justify-center items-center gap-4 mt-10'>
              <Motion.button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true)
                    return;
                  }
                  navigate("/interview")
                }}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-400 text-neutral-950 font-bold tracking-wide px-8 py-4 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all duration-300 cursor-pointer text-sm uppercase'>
                Start Free Interview
              </Motion.button>

              <Motion.button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true)
                    return;
                  }
                  navigate("/history")
                }}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-bold tracking-wide px-8 py-4 rounded-full transition-all duration-300 cursor-pointer text-sm uppercase shadow-lg backdrop-blur-md'>
                View Reports History
              </Motion.button>
            </div>
          </div>

          {/* Step Workflow Cards */}
          <div className='flex flex-col lg:flex-row justify-center items-stretch gap-8 mb-32 md:mb-40 max-w-5xl mx-auto'>
            {
              [
                {
                  icon: <BsRobot size={22} />,
                  step: "01",
                  title: "Role Customization",
                  desc: "Select your target job role and experience level. AI dynamically updates question scopes.",
                  badge: "Step 1"
                },
                {
                  icon: <BsMic size={22} />,
                  step: "02",
                  title: "Dynamic Simulation",
                  desc: "Conduct voice or text responses. AI responds with context-aware follow-up questions.",
                  badge: "Step 2"
                },
                {
                  icon: <BsClock size={22} />,
                  step: "03",
                  title: "Instant Analytics",
                  desc: "Unlock scores for communication accuracy, technical depth, and actionable advice.",
                  badge: "Step 3"
                }
              ].map((item, index) => (
                <Motion.div key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  whileHover={{ y: -8, scale: 1.01, transition: { duration: 0.15, delay: 0 } }}
                  className={`flex-1 relative glass-card rounded-3xl p-8 shadow-2xl hover:shadow-[0_0_40px_rgba(16,185,129,0.22)] border border-white/10 hover:border-brand-500/50 transition-all duration-250 flex flex-col justify-between backdrop-blur-xl`}>
                  
                  <div>
                    <div className='flex justify-between items-center mb-6'>
                      <div className='bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 text-emerald-400 w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0_4px_20px_rgba(16,185,129,0.1)]'>
                        {item.icon}
                      </div>
                      <span className='text-4xl font-black bg-gradient-to-b from-white/10 to-transparent bg-clip-text text-transparent select-none font-sans'>{item.step}</span>
                    </div>

                    <h3 className='font-bold text-white mb-3 text-lg sm:text-xl'>{item.title}</h3>
                    <p className='text-xs sm:text-sm text-slate-400 leading-relaxed'>{item.desc}</p>
                  </div>

                  <div className='mt-6 pt-4 border-t border-white/10 flex items-center justify-between'>
                    <span className='text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 w-fit'>{item.badge}</span>
                  </div>
                </Motion.div>
              ))
            }
          </div>

          {/* AI Capabilities */}
          <div className='mb-32 md:mb-40'>
            <Motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className='text-3xl md:text-5xl font-black text-center tracking-tight text-white mb-16 sm:mb-20'>
              Advanced AI <span className="text-emerald-400 bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Capabilities</span>
            </Motion.h2>

            <div className='grid md:grid-cols-2 gap-8'>
              {
                [
                  {
                    image: evalImg,
                    icon: <BsBarChart size={18} />,
                    title: "Instant Performance Metrics",
                    desc: "Grades technical correctness, speech speed, structure, and readability parameters in minutes."
                  },
                  {
                    image: resumeImg,
                    icon: <BsFileEarmarkText size={18} />,
                    title: "Resume-Driven Context",
                    desc: "Parses your CV dynamically to generate custom-tailored projects and resume-relevant interview sessions."
                  },
                  {
                    image: pdfImg,
                    icon: <BsFileEarmarkText size={18} />,
                    title: "Downloadable PDF Analytics",
                    desc: "Exports complete question-wise feedback summaries, scores, and professional development suggestions."
                  },
                  {
                    image: analyticsImg,
                    icon: <BsBarChart size={18} />,
                    title: "Preparation Trend Tracking",
                    desc: "Monitors progress metrics, scores, and mock timelines across all your sessions in a clean dashboard."
                  }
                ].map((item, index) => (
                  <Motion.div key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -4, scale: 1.015, transition: { duration: 0.15, delay: 0 } }}
                    className='glass-card rounded-3xl p-6 sm:p-8 shadow-2xl hover:shadow-[0_0_35px_rgba(16,185,129,0.22)] border border-white/10 hover:border-emerald-500/50 transition-all duration-250 backdrop-blur-xl'>
                    <div className='flex flex-col sm:flex-row items-center gap-6 sm:gap-8'>
                      <div className='w-full sm:w-1/2 flex justify-center bg-neutral-950/60 rounded-2xl p-4 border border-white/10'>
                        <img src={item.image} alt={item.title} className='w-full h-auto object-contain max-h-44 rounded-xl opacity-90' />
                      </div>

                      <div className='w-full sm:w-1/2'>
                        <div className='bg-gradient-to-br from-emerald-500/15 to-teal-500/5 border border-emerald-500/30 text-emerald-400 w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-md'>
                          {item.icon}
                        </div>
                        <h3 className='font-bold text-white mb-2.5 text-lg'>{item.title}</h3>
                        <p className='text-slate-400 text-xs sm:text-sm leading-relaxed'>{item.desc}</p>
                      </div>
                    </div>
                  </Motion.div>
                ))
              }
            </div>
          </div>

          {/* Interview Modes */}
          <div className='mb-24 md:mb-32'>
            <Motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className='text-3xl md:text-5xl font-black text-center tracking-tight text-white mb-16 sm:mb-20'>
              Engineered for <span className="text-emerald-400 bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Growth</span>
            </Motion.h2>

            <div className='grid md:grid-cols-2 gap-8'>
              {
                [
                  {
                    img: hrImg,
                    title: "HR Behavioral Mode",
                    desc: "Evaluates situational analysis, soft skills, company-fit benchmarks, and leadership questions."
                  },
                  {
                    img: techImg,
                    title: "Deep Technical Mode",
                    desc: "Asks fundamental domain questions, system architectural inquiries, and programming theory."
                  },
                  {
                    img: confidenceImg,
                    title: "Speech & Confidence Metrics",
                    desc: "Examines vocal patterns and tone variables to deliver helpful communication feedback."
                  },
                  {
                    img: creditImg,
                    title: "Flexible Credit System",
                    desc: "Simple package tiers designed to provide uninterrupted mock interview session iterations."
                  }
                ].map((mode, index) => (
                  <Motion.div key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -6, scale: 1.015, transition: { duration: 0.15, delay: 0 } }}
                    className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl hover:shadow-[0_0_35px_rgba(16,185,129,0.22)] border border-white/10 hover:border-emerald-500/50 transition-all duration-250 backdrop-blur-xl">

                    <div className='flex items-center justify-between gap-6'>
                      <div className="w-2/3">
                        <h3 className="font-bold text-white text-lg sm:text-xl mb-2.5">
                          {mode.title}
                        </h3>
                        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                          {mode.desc}
                        </p>
                      </div>

                      <div className="w-1/3 flex justify-end bg-neutral-950/80 p-3 rounded-2xl border border-white/10 shadow-inner">
                        <img
                          src={mode.img}
                          alt={mode.title}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-contain brightness-95"
                        />
                      </div>
                    </div>
                  </Motion.div>
                ))
              }
            </div>
          </div>

        </div>
      </div>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
      <Footer/>
    </div>
  )
}

export default Home
