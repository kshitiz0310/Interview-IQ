import React from 'react'
import { BsRobot } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5";
import { motion } from "motion/react"
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';
import axios from 'axios';
import { ServerUrl } from '../config';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function Auth({isModel = false}) {
    const dispatch = useDispatch()
    const Motion = motion

    const handleGoogleAuth = async () => {
        try {
            const response = await signInWithPopup(auth,provider)
            let User = response.user
            let name = User.displayName
            let email = User.email
            const result = await axios.post(ServerUrl + "/api/auth/google" , {name , email} , {withCredentials:true})
            dispatch(setUserData(result.data))
        } catch (error) {
            console.log(error)
            dispatch(setUserData(null))
        }
    }

    return (
        <div className={`
            w-full flex items-center justify-center
            ${isModel ? "p-6 sm:p-8 bg-transparent" : "min-h-screen bg-[#030307] bg-grid-pattern px-6 py-20 text-zinc-100"}
        `}>
            {isModel ? (
                <div className="w-full">
                    {/* Logo Header */}
                    <div className='flex items-center justify-center gap-3 mb-6'>
                        <div className='bg-white/5 border border-white/10 text-white p-2 rounded-full shadow-md'>
                            <BsRobot size={16}/>
                        </div>
                        <span className='font-black text-lg tracking-tighter text-white'>
                            InterviewIQ<span className="text-emerald-400 font-extrabold">.AI</span>
                        </span>
                    </div>

                    {/* Main Heading */}
                    <h1 className='text-2xl sm:text-3xl font-black text-center tracking-tight text-white mb-3 leading-snug'>
                        Experience Next-Gen <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">AI Mock Sessions</span>
                    </h1>

                    {/* Subtitle */}
                    <p className='text-slate-400 text-center text-xs sm:text-sm leading-relaxed mb-8'>
                        Access voice-based simulations, instant evaluations, and customized dashboards configured directly for your career goals.
                    </p>

                    {/* Continue with Google button */}
                    <Motion.button 
                        onClick={handleGoogleAuth}
                        whileHover={{ y: -1, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className='w-full flex items-center justify-center gap-3 py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-neutral-950 font-black rounded-full shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_35px_rgba(16,185,129,0.4)] transition-all duration-300 cursor-pointer text-sm uppercase tracking-wide'
                    >
                        <FcGoogle size={18} className="bg-white p-1 rounded-full animate-pulse" />
                        <span>Continue with Google</span>
                    </Motion.button>
                    
                    {/* Agreement note */}
                    <p className="text-[10px] text-slate-500 text-center mt-6 leading-relaxed">
                      By signing in, you agree to our Terms of Service and Privacy Policy. Secure authentication managed by Google Firebase.
                    </p>
                </div>
            ) : (
                <Motion.div 
                    initial={{opacity:0 , y: 25}} 
                    animate={{opacity:1 , y:0}} 
                    transition={{duration: 0.5, ease: "easeOut"}}
                    className="w-full glass-dark border border-white/10 shadow-2xl max-w-md p-10 rounded-[32px]"
                >
                    {/* Logo Header */}
                    <div className='flex items-center justify-center gap-3 mb-6'>
                        <div className='bg-white/5 border border-white/10 text-white p-2 rounded-full shadow-md'>
                            <BsRobot size={16}/>
                        </div>
                        <span className='font-black text-lg tracking-tighter text-white'>
                            InterviewIQ<span className="text-emerald-400 font-extrabold">.AI</span>
                        </span>
                    </div>

                    {/* Main Heading */}
                    <h1 className='text-2xl sm:text-3xl font-black text-center tracking-tight text-white mb-3 leading-snug'>
                        Experience Next-Gen <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">AI Mock Sessions</span>
                    </h1>

                    {/* Subtitle */}
                    <p className='text-slate-400 text-center text-xs sm:text-sm leading-relaxed mb-8'>
                        Access voice-based simulations, instant evaluations, and customized dashboards configured directly for your career goals.
                    </p>

                    {/* Continue with Google button */}
                    <Motion.button 
                        onClick={handleGoogleAuth}
                        whileHover={{ y: -1, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className='w-full flex items-center justify-center gap-3 py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-neutral-950 font-black rounded-full shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_35px_rgba(16,185,129,0.4)] transition-all duration-300 cursor-pointer text-sm uppercase tracking-wide'
                    >
                        <FcGoogle size={18} className="bg-white p-1 rounded-full animate-pulse" />
                        <span>Continue with Google</span>
                    </Motion.button>
                    
                    {/* Agreement note */}
                    <p className="text-[10px] text-slate-500 text-center mt-6 leading-relaxed">
                      By signing in, you agree to our Terms of Service and Privacy Policy. Secure authentication managed by Google Firebase.
                    </p>
                </Motion.div>
            )}
        </div>
    )
}

export default Auth
