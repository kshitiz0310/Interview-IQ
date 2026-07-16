import React from 'react'
import { motion } from "motion/react"
import {
    FaUserTie,
    FaBriefcase,
    FaFileUpload,
    FaMicrophoneAlt,
    FaChartLine,
    FaArrowLeft
} from "react-icons/fa";
import { useState } from 'react';
import axios from "axios"
import { ServerUrl } from '../config';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';

function Step1SetUp({ onStart }) {
    const {userData}= useSelector((state)=>state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [role, setRole] = useState("");
    const [experience, setExperience] = useState("");
    const [mode, setMode] = useState("Technical");
    const [resumeFile, setResumeFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [resumeText, setResumeText] = useState("");
    const [analysisDone, setAnalysisDone] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [jobDescription, setJobDescription] = useState("");
    const Motion = motion

    const handleUploadResume = async () => {
        if (!resumeFile || analyzing) return;
        setAnalyzing(true)

        const formdata = new FormData()
        formdata.append("resume", resumeFile)

        try {
            const result = await axios.post(ServerUrl + "/api/interview/resume", formdata, { withCredentials: true })
            console.log(result.data)

            setRole(result.data.role || "");
            setExperience(result.data.experience || "");
            setProjects(result.data.projects || []);
            setSkills(result.data.skills || []);
            setResumeText(result.data.resumeText || "");
            setAnalysisDone(true);
            setAnalyzing(false);
        } catch (error) {
            console.log(error)
            setAnalyzing(false);
        }
    }

    const handleStart = async () => {
        setLoading(true)
        try {
           const result = await axios.post(ServerUrl + "/api/interview/generate-questions" , {role, experience, mode , resumeText, projects, skills, jobDescription } , {withCredentials:true}) 
           console.log(result.data)
           if(userData){
            dispatch(setUserData({...userData , credits:result.data.creditsLeft}))
           }
           setLoading(false)
           onStart(result.data)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

  return (
        <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className='min-h-screen flex flex-col justify-center bg-[#030307] text-zinc-100 bg-grid-pattern px-4 py-6 sm:py-10 relative overflow-hidden'
        >
            {/* Background ambient glows */}
            <div className="absolute top-[-10%] left-[-15%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-emerald-500/12 to-indigo-500/15 blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-15%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-cyan-500/10 to-teal-500/12 blur-[130px] pointer-events-none"></div>
            
            <div className='w-full max-w-5xl glass-card rounded-3xl shadow-2xl border border-white/10 grid md:grid-cols-12 overflow-hidden mx-auto relative z-10 backdrop-blur-xl bg-slate-950/20'>
                
                {/* Left Side Panel */}
                <Motion.div
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className='md:col-span-5 bg-[#080812]/70 p-6 sm:p-8 flex flex-col justify-between text-white relative border-r border-white/10 backdrop-blur-xl'
                >
                    <div className="absolute top-0 right-0 left-0 bottom-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.1),transparent_60%)] pointer-events-none"></div>
                    
                    <div>
                        <button 
                            onClick={() => navigate("/")} 
                            className='flex items-center gap-2 text-emerald-450 hover:text-emerald-350 transition-colors cursor-pointer text-xs mb-6 font-semibold tracking-wider uppercase'
                        >
                            <FaArrowLeft size={10} /> Back to Home
                        </button>
                        
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tighter mb-3 text-white">
                            Configure Your Session
                        </h2>
                        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                            Configure your target job role and experience level. The AI engine will dynamically calibrate questions, tone, and scenarios to match industry benchmarks.
                        </p>
                    </div>

                    <div className='space-y-3 relative z-10'>
                        {[
                            {
                                icon: <FaUserTie className="text-emerald-400 text-sm" />,
                                text: "Custom Roles & Experience",
                            },
                            {
                                icon: <FaMicrophoneAlt className="text-emerald-400 text-sm" />,
                                text: "Smart Voice Dialogue",
                            },
                            {
                                icon: <FaChartLine className="text-emerald-400 text-sm" />,
                                text: "Detailed Qualitative Reports",
                            },
                        ].map((item, index) => (
                            <div 
                                key={index}
                                className='flex items-center space-x-3 bg-white/5 border border-white/10 hover:border-emerald-500/20 p-2.5 rounded-xl shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.05)] transition-all duration-300'
                            >
                                <div className="bg-emerald-500/10 border border-emerald-500/20 p-1.5 rounded-lg flex-shrink-0">
                                    {item.icon}
                                </div>
                                <span className='text-zinc-200 font-semibold text-xs sm:text-sm'>{item.text}</span>
                            </div>
                        ))}
                    </div>
                </Motion.div>

                {/* Right Side Form */}
                <Motion.div
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="md:col-span-7 p-6 sm:p-8 bg-transparent flex flex-col justify-center"
                >
                    <h2 className='text-xl sm:text-2xl font-black text-white mb-1.5 tracking-tight'>
                        Interview Setup
                    </h2>
                    <p className="text-slate-400 text-xs sm:text-sm mb-5">
                        Enter details manually or parse your resume to prefill the fields automatically.
                    </p>

                    <div className='space-y-4'>
                        {/* Role Input */}
                        <div className='relative'>
                            <FaUserTie className='absolute top-4 left-4.5 text-neutral-500 text-sm' />
                            <input 
                                type='text' 
                                placeholder='Target Role (e.g. Software Engineer)'
                                className='w-full pl-12 pr-4 py-3.5 bg-neutral-950/40 border border-white/10 hover:border-white/20 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-[#030307] outline-none text-xs sm:text-sm transition-all text-zinc-100 shadow-inner'
                                onChange={(e) => setRole(e.target.value)} 
                                value={role} 
                            />
                        </div>

                        {/* Experience Input */}
                        <div className='relative'>
                            <FaBriefcase className='absolute top-4 left-4.5 text-neutral-500 text-sm' />
                            <input 
                                type='text' 
                                placeholder='Experience (e.g. 2 years)'
                                className='w-full pl-12 pr-4 py-3.5 bg-neutral-950/40 border border-white/10 hover:border-white/20 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-[#030307] outline-none text-xs sm:text-sm transition-all text-zinc-100 shadow-inner'
                                onChange={(e) => setExperience(e.target.value)} 
                                value={experience} 
                            />
                        </div>

                        {/* Mode select */}
                        <div className="relative">
                            <select 
                                value={mode}
                                onChange={(e) => setMode(e.target.value)}
                                className='w-full py-3 px-4 bg-neutral-950/40 border border-white/10 hover:border-white/20 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-[#030307] outline-none text-xs sm:text-sm transition-all text-zinc-100 cursor-pointer appearance-none shadow-inner'
                            >
                                <option value="Technical" className="bg-[#09090d] text-zinc-100">Technical Interview Mode</option>
                                <option value="HR" className="bg-[#09090d] text-zinc-100">HR Behavioral Mode</option>
                            </select>
                            <div className="absolute top-3.5 right-4 pointer-events-none text-xs text-neutral-450 font-bold">&darr;</div>
                        </div>

                        {/* Job Description (Optional) */}
                        <div className='relative'>
                            <textarea 
                                placeholder='Paste Target Job Description (Optional) - AI will calibrate questions based on skill gaps'
                                className='w-full px-4 py-3 bg-neutral-950/40 border border-white/10 hover:border-white/20 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-[#030307] outline-none text-xs sm:text-sm transition-all text-zinc-100 shadow-inner h-20 resize-none'
                                onChange={(e) => setJobDescription(e.target.value)} 
                                value={jobDescription} 
                            />
                        </div>

                        {/* Resume Upload Zone - Compact Row Layout */}
                        {!analysisDone && (
                            <Motion.div
                                whileHover={{ scale: 1.005 }}
                                onClick={() => document.getElementById("resumeUpload").click()}
                                className='border border-dashed border-white/10 hover:border-emerald-500/40 rounded-xl p-3.5 text-center cursor-pointer bg-white/[0.01] hover:bg-emerald-500/[0.01] transition-all duration-300 flex items-center justify-center gap-3.5 shadow-sm'
                            >
                                <FaFileUpload className='text-xl text-emerald-450 animate-pulse flex-shrink-0' />
                                
                                <input 
                                    type="file"
                                    accept="application/pdf"
                                    id="resumeUpload"
                                    className='hidden'
                                    onChange={(e) => setResumeFile(e.target.files[0])} 
                                    onClick={(e) => e.stopPropagation()}
                                />

                                <div className="text-left text-zinc-100">
                                    <p className='text-zinc-200 text-xs font-semibold'>
                                        {resumeFile ? resumeFile.name : "Upload PDF Resume (Optional)"}
                                    </p>
                                    {!resumeFile && (
                                        <p className="text-[10px] text-zinc-500 mt-0.5">Allows automatic parsing of skills & projects</p>
                                    )}
                                </div>

                                {resumeFile && (
                                    <Motion.button
                                        whileHover={{ y: -1 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUploadResume()
                                        }}
                                        className='ml-auto bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-neutral-950 font-bold text-[10px] uppercase tracking-wider px-3.5 py-1.5 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all cursor-pointer flex-shrink-0'
                                    >
                                        {analyzing ? "Parsing..." : "Extract Data"}
                                    </Motion.button>
                                )}
                            </Motion.div>
                        )}

                        {/* Resume Analysis Result Details */}
                        {analysisDone && (
                            <Motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className='bg-neutral-950/40 border border-white/10 rounded-2xl p-4.5 shadow-inner text-zinc-100 flex flex-col'
                            >
                                {/* Header (Static above the scroll block) */}
                                <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3 flex-shrink-0">
                                    <h3 className='text-xs font-bold uppercase tracking-wider text-white'>
                                        Parsed CV Information
                                    </h3>
                                    <span className="text-[10px] bg-emerald-500/10 text-emerald-300 font-bold px-2 py-0.5 rounded-md border border-emerald-500/20">success</span>
                                </div>

                                {/* Scrollable Content */}
                                <div className="max-h-[110px] overflow-y-auto space-y-4 pr-1">
                                    {projects.length > 0 && (
                                        <div>
                                            <p className='font-semibold text-xs text-zinc-200 mb-1.5'>Projects Detected</p>
                                            <ul className='list-disc list-inside text-xs text-zinc-400 space-y-1.5 pl-1 leading-relaxed'>
                                                {projects.map((p, i) => (
                                                    <li key={i} className="text-zinc-350 font-medium">{p}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {skills.length > 0 && (
                                        <div>
                                            <p className='font-semibold text-xs text-zinc-200 mb-2'>Core Skills Detected</p>
                                            <div className='flex flex-wrap gap-1.5'>
                                                {skills.map((s, i) => (
                                                    <span key={i} className='bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-md text-[10px] font-bold'>{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Motion.div>
                        )}

                        {/* Start Button */}
                        <Motion.button
                            onClick={handleStart}
                            disabled={!role || !experience || loading}
                            whileHover={{ y: -1 }}
                            whileTap={{ scale: 0.98 }}
                            className='w-full disabled:bg-white/5 disabled:text-zinc-600 disabled:cursor-not-allowed disabled:shadow-none bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-neutral-950 py-4 rounded-full text-sm sm:text-base font-black uppercase tracking-wider transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.25)] hover:shadow-[0_0_40px_rgba(16,185,129,0.45)] cursor-pointer mt-6'
                        >
                            {loading ? "Initializing Session...":"Start Session"}
                        </Motion.button>
                    </div>
                </Motion.div>
            </div>
        </Motion.div>
    )
}

export default Step1SetUp
