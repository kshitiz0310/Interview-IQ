import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from "motion/react"
import { BsRobot, BsCoin } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ServerUrl } from '../config';
import { setUserData } from '../redux/userSlice';
import AuthModel from './AuthModel';

function Navbar() {
    const {userData} = useSelector((state)=>state.user)
    const [showCreditPopup,setShowCreditPopup] = useState(false)
    const [showUserPopup,setShowUserPopup] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [showAuth, setShowAuth] = useState(false);
    const Motion = motion

    const handleLogout = async () => {
        try {
            await axios.get(ServerUrl + "/api/auth/logout" , {withCredentials:true})
            dispatch(setUserData(null))
            setShowCreditPopup(false)
            setShowUserPopup(false)
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='bg-[#030307]/10 backdrop-blur-md sticky top-0 z-[100] flex justify-center px-4 py-5 md:px-8'>
            <Motion.div 
                initial={{opacity:0 , y:-20}}
                animate={{opacity:1 , y:0}}
                transition={{duration: 0.4, ease: "easeOut"}}
                className='w-full max-w-6xl glass rounded-full shadow-2xl px-6 py-2.5 flex justify-between items-center relative border border-white/10 bg-slate-950/30 backdrop-blur-xl'>
                
                {/* Brand Logo */}
                <div onClick={() => navigate("/")} className='flex items-center gap-3 cursor-pointer group'>
                    <div className='bg-white/5 border border-white/10 text-white p-2.5 rounded-full group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-teal-500 group-hover:text-neutral-950 transition-all duration-300 shadow-lg group-hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]'>
                        <BsRobot size={18} className="group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                    <span className='font-black hidden md:block text-lg tracking-tighter bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent group-hover:from-white group-hover:to-emerald-300 transition-all duration-300'>
                        InterviewIQ<span className="text-emerald-400 font-extrabold">.AI</span>
                    </span>
                </div>

                {/* Right Controls */}
                <div className='flex items-center gap-4 relative'>
                    
                    {/* Credits Button */}
                    <div className='relative'>
                        <button 
                            onClick={()=>{
                                if(!userData){
                                    setShowAuth(true)
                                    return;
                                }
                                setShowCreditPopup(!showCreditPopup);
                                setShowUserPopup(false)
                            }} 
                            className='flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 active:scale-95 text-emerald-300 font-bold px-4.5 py-2 rounded-full text-xs uppercase tracking-wider transition-all duration-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)] cursor-pointer'
                        >
                            <BsCoin size={14} className="text-amber-450 animate-bounce" />
                            <span>{userData?.credits || 0} Credits</span>
                        </button>

                        <AnimatePresence>
                            {showCreditPopup && (
                                <Motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className='absolute right-[-20px] md:right-0 mt-3 w-64 bg-neutral-950/95 border border-white/10 shadow-2xl rounded-2xl p-5 z-50 overflow-hidden backdrop-blur-xl'
                                >
                                    <p className='text-xs text-zinc-400 leading-relaxed mb-4'>
                                        Need more credits to continue AI-powered interviews? Upgrade your plan anytime.
                                    </p>
                                    <button 
                                        onClick={() => {
                                            setShowCreditPopup(false);
                                            navigate("/pricing");
                                        }} 
                                        className='w-full bg-brand-500 hover:bg-brand-400 text-neutral-950 font-bold py-2.5 rounded-xl text-xs shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-colors duration-250 cursor-pointer'
                                    >
                                        Buy more credits
                                    </button>
                                </Motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* User Profile Button */}
                    <div className='relative'>
                        <button
                            onClick={()=>{
                                if(!userData){
                                    setShowAuth(true)
                                    return;
                                }
                                setShowUserPopup(!showUserPopup);
                                setShowCreditPopup(false)
                            }} 
                            className='w-9 h-9 bg-white/5 hover:bg-gradient-to-r hover:from-emerald-400 hover:to-teal-500 text-white hover:text-neutral-950 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer shadow-md hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-300 active:scale-95 border border-white/10'
                        >
                            {userData ? userData?.name.slice(0,1).toUpperCase() : <FaUserAstronaut size={14} className="text-neutral-300"/>}
                        </button>

                        <AnimatePresence>
                            {showUserPopup && (
                                <Motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className='absolute right-0 mt-3 w-56 bg-neutral-950/95 border border-white/10 shadow-2xl rounded-2xl p-3 z-50 backdrop-blur-xl'
                                >
                                    <div className='px-3 py-2 border-b border-white/5 mb-2'>
                                        <p className='text-[10px] text-zinc-500 font-medium'>Signed in as</p>
                                        <p className='text-sm text-zinc-100 font-semibold truncate'>{userData?.name}</p>
                                    </div>

                                    <button 
                                        onClick={() => {
                                            setShowUserPopup(false);
                                            navigate("/history");
                                        }} 
                                        className='w-full text-left text-xs px-3 py-2.5 hover:bg-white/5 rounded-xl text-zinc-300 hover:text-white font-medium transition-colors cursor-pointer'
                                    >
                                        Interview History
                                    </button>
                                    
                                    <button 
                                        onClick={handleLogout} 
                                        className='w-full text-left text-xs px-3 py-2.5 hover:bg-red-950/30 rounded-xl flex items-center gap-2 text-red-400 hover:text-red-300 font-medium transition-colors cursor-pointer mt-1'
                                    >
                                        <HiOutlineLogout size={14}/>
                                        Logout
                                    </button>
                                </Motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>

            </Motion.div>

            {showAuth && <AuthModel onClose={()=>setShowAuth(false)}/>}
        </div>
    )
}

export default Navbar
