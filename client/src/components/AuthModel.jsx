import React from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FaTimes } from "react-icons/fa";
import { motion } from "motion/react";
import { createPortal } from 'react-dom';
import Auth from '../pages/auth';

function AuthModel({onClose}) {
    const {userData} = useSelector((state)=>state.user)
    const Motion = motion

    useEffect(()=>{
        if(userData){
            onClose()
        }
    },[userData , onClose])

    return createPortal(
        <Motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='fixed inset-0 z-[999] flex items-center justify-center bg-black/45 backdrop-blur-md px-4'
        >
            <Motion.div 
                initial={{ opacity: 0, scale: 0.92, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
                className='relative w-full max-w-md glass-dark rounded-[32px] shadow-2xl border border-white/10 overflow-hidden'
            >
                <button 
                    onClick={onClose} 
                    className='absolute top-6 right-6 text-zinc-400 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 p-2 rounded-full transition-all duration-200 cursor-pointer active:scale-95 z-[60]'
                    aria-label="Close modal"
                >
                    <FaTimes size={14}/>
                </button>
                <Auth isModel={true}/>
            </Motion.div>
        </Motion.div>,
        document.body
    )
}

export default AuthModel
