import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { ServerUrl } from '../config'
import { FaArrowLeft, FaTrash } from 'react-icons/fa'

function InterviewHistory() {
    const [interviews, setInterviews] = useState([])
    const [deleteTargetId, setDeleteTargetId] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const getMyInterviews = async () => {
            try {
                const result = await axios.get(ServerUrl + "/api/interview/get-interview", { withCredentials: true })
                setInterviews(result.data)
            } catch (error) {
                console.log(error)
            }
        }
        getMyInterviews()
    }, [])

    const confirmDelete = async () => {
        if (!deleteTargetId) return;
        try {
            await axios.delete(`${ServerUrl}/api/interview/delete-interview/${deleteTargetId}`, { withCredentials: true })
            setInterviews(interviews.filter(item => item._id !== deleteTargetId))
            setDeleteTargetId(null);
        } catch (error) {
            console.log(error)
            alert("Failed to delete interview session.")
            setDeleteTargetId(null);
        }
    }

    return (
        <div className='min-h-screen bg-[#030307] text-zinc-100 bg-grid-pattern py-12 relative overflow-hidden'>
            {/* Background ambient glows */}
            <div className="absolute top-[-10%] left-[-15%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-emerald-500/10 to-indigo-500/12 blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-15%] w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-cyan-500/10 to-teal-500/12 blur-[140px] pointer-events-none"></div>

            <div className='w-[90vw] lg:w-[70vw] max-w-[90%] mx-auto relative z-10'>

                <div className='mb-10 w-full flex items-center gap-4'>
                    <button
                        onClick={() => navigate("/")}
                        className='p-3.5 rounded-full bg-neutral-900/40 border border-white/10 shadow-md hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:bg-neutral-900 active:scale-95 transition-all cursor-pointer'
                    >
                        <FaArrowLeft className='text-zinc-300' size={14} />
                    </button>

                    <div>
                        <h1 className='text-3xl font-black tracking-tighter text-white'>
                            Interview History
                        </h1>
                        <p className='text-slate-400 text-sm mt-1'>
                            Track your past mock sessions, performance indexes, and AI feedback reports
                        </p>
                    </div>
                </div>

                {interviews.length === 0 ? (
                    <div className='glass-card border border-white/10 shadow-2xl backdrop-blur-xl p-12 rounded-3xl text-center max-w-xl mx-auto mt-8'>
                        <div className="w-16 h-16 bg-neutral-950/60 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-300 shadow-xs">
                          ⚡
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">No mock sessions found</h3>
                        <p className='text-slate-400 text-sm leading-relaxed mb-6'>
                            You haven't completed any mock interviews yet. Start your first session to receive your detailed evaluation dashboard.
                        </p>
                        <button 
                          onClick={() => navigate("/interview")} 
                          className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-neutral-950 font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-colors cursor-pointer animate-pulse"
                        >
                          Start Your First Session
                        </button>
                    </div>
                ) : (
                    <div className='grid gap-4 mt-8'>
                        {interviews.map((item, index) => (
                            <div 
                                key={index}
                                onClick={() => navigate(`/report/${item._id}`)}
                                className='glass-card border border-white/10 hover:border-brand-500/40 shadow-lg hover:shadow-[0_0_30px_rgba(16,185,129,0.08)] transition-all duration-300 cursor-pointer p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 backdrop-blur-xl'
                            >
                                <div className="space-y-1.5">
                                    <span className="bg-white/5 text-zinc-300 border border-white/10 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.8 rounded-md">
                                        Session #{interviews.length - index}
                                    </span>
                                    
                                    <h3 className="text-lg font-bold text-white pt-1">
                                        {item.role}
                                    </h3>
 
                                    <p className="text-slate-400 text-xs font-medium">
                                        {item.experience} &bull; <span className="text-zinc-350">{item.mode} Mode</span>
                                    </p>
 
                                    <p className="text-[10px] text-zinc-550">
                                        Completed on {new Date(item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>

                                <div className='flex items-center justify-between sm:justify-end gap-6 pt-4 sm:pt-0 border-t sm:border-t-0 border-white/10'>
                                    {/* SCORE */}
                                    <div className="text-left sm:text-right">
                                        <p className="text-2xl font-black text-brand-300">
                                            {item.finalScore || 0}<span className="text-xs text-zinc-500 font-bold">/10</span>
                                        </p>
                                        <p className="text-[10px] text-zinc-550 font-semibold uppercase tracking-wider">
                                            Performance Index
                                        </p>
                                    </div>

                                    {/* STATUS BADGE */}
                                    <span
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border
                                            ${item.status === "completed"
                                                ? "bg-brand-500/10 text-brand-300 border-brand-500/20"
                                                : "bg-amber-500/10 text-amber-300 border-amber-500/20"
                                            }`}
                                    >
                                        {item.status}
                                    </span>

                                    {/* DELETE BUTTON */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDeleteTargetId(item._id);
                                        }}
                                        className='p-3.5 rounded-xl bg-red-950/20 hover:bg-red-900/40 border border-red-500/25 hover:border-red-500/50 text-red-400 hover:text-red-300 active:scale-95 transition-all duration-200 cursor-pointer shadow-xs shadow-red-950/20'
                                        title='Delete Session'
                                    >
                                        <FaTrash size={12} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Custom Center Confirmation Modal */}
            {deleteTargetId && (
                <div className='fixed inset-0 z-50 bg-[#060609]/80 backdrop-blur-md flex items-center justify-center p-4 select-none'>
                    <div className='w-full max-w-sm bg-neutral-900/40 border border-red-500/20 p-8 rounded-3xl backdrop-blur-xl text-center space-y-6 shadow-2xl relative z-10 animate-fade-in'>
                        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-450 animate-bounce">
                            <FaTrash size={18} />
                        </div>
                        
                        <div className="space-y-2">
                            <h2 className="text-xl font-black text-white tracking-tight">Delete Mock Session?</h2>
                            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                                Are you sure you want to permanently delete this mock interview session? All feedback report metrics will be lost.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setDeleteTargetId(null)}
                                className='flex-1 bg-neutral-800 hover:bg-neutral-700 text-zinc-200 border border-white/5 py-3 rounded-2xl transition-all font-bold text-xs uppercase tracking-wider cursor-pointer'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className='flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-450 hover:to-rose-500 text-white py-3 rounded-2xl shadow-[0_0_20px_rgba(239,68,68,0.25)] transition-all font-bold text-xs uppercase tracking-wider cursor-pointer'
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default InterviewHistory
