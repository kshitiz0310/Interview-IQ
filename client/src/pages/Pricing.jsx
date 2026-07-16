import React, { useState } from 'react'
import { FaArrowLeft, FaCheck } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { motion } from "motion/react";
import axios from 'axios';
import { ServerUrl } from '../config';

function Pricing() {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [loadingPlan, setLoadingPlan] = useState(null);
  const Motion = motion

  const plans = [
    {
      id: "free",
      name: "Starter Trial",
      price: "₹0",
      credits: 100,
      description: "Perfect for beginners starting their interview prep journey.",
      features: [
        "100 AI Interview Credits",
        "Standard Performance Scorecards",
        "Voice Interview Simulation",
        "30-day History Tracking",
      ],
      default: true,
    },
    {
      id: "basic",
      name: "Starter Pack",
      price: "₹100",
      credits: 150,
      description: "Great for focused practice and general skill improvement.",
      features: [
        "150 AI Interview Credits",
        "Detailed Qualitative Feedback",
        "Interactive Performance Trends",
        "Unlimited History Log",
      ],
    },
    {
      id: "pro",
      name: "Professional Pack",
      price: "₹500",
      credits: 650,
      description: "Ultimate value for candidates ready for real interviews.",
      features: [
        "650 AI Interview Credits",
        "Advanced System Feedback",
        "Cross-session Trend Analysis",
        "Priority AI Response Generation",
      ],
      badge: "Best Value",
    },
  ];

  const handlePayment = async (plan) => {
    try {
      setLoadingPlan(plan.id)

      const amount =  
      plan.id === "basic" ? 100 :
      plan.id === "pro" ? 500 : 0;

      const result = await axios.post(ServerUrl + "/api/payment/order" , {
        planId: plan.id,
        amount: amount,
        credits: plan.credits,
      },{withCredentials:true})
      
      if (result.data && result.data.url) {
        // Redirect directly to Stripe Checkout session url
        window.location.href = result.data.url;
      } else {
        throw new Error("Invalid payment session URL returned from server.");
      }
    } catch (error) {
      console.log(error)
      alert("Failed to initiate secure checkout process.")
      setLoadingPlan(null);
    }
  }

  return (
    <div className='min-h-screen bg-[#030307] text-zinc-100 bg-grid-pattern py-16 px-6 relative overflow-hidden'>
      {/* Background ambient glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-emerald-500/10 to-indigo-500/12 blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-cyan-500/10 to-teal-500/12 blur-[140px] pointer-events-none"></div>

      <div className='max-w-6xl mx-auto mb-16 relative z-10'>
        <div className='flex items-center gap-4 mb-8'>
          <button 
            onClick={() => navigate("/")} 
            className='p-3.5 rounded-full bg-neutral-900/40 border border-white/10 shadow-md hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:bg-neutral-900 active:scale-95 transition-all cursor-pointer'
          >
            <FaArrowLeft className='text-zinc-300' size={14} />
          </button>
          
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Select Plan</span>
        </div>

        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter">
            Flexible Pricing for <span className="bg-gradient-to-r from-emerald-400 via-teal-355 to-cyan-400 bg-clip-text text-transparent">Every Goal</span>
          </h1>
          <p className="text-slate-400 mt-4 text-base sm:text-lg">
            Choose a plan that fits your interview preparation checklist. Boost your performance metrics today.
          </p>
        </div>
      </div>

      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10 items-stretch'>
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id

          return (
            <Motion.div 
              key={plan.id}
              whileHover={!plan.default ? { y: -6 } : {}}
              onClick={() => !plan.default && setSelectedPlan(plan.id)}
              className={`relative rounded-3xl p-8 transition-all duration-300 border flex flex-col justify-between backdrop-blur-xl bg-slate-900/10
                ${isSelected
                  ? "border-brand-500 shadow-[0_0_35px_rgba(16,185,129,0.18)] ring-1 ring-brand-500/20"
                  : "border-white/10 shadow-lg hover:border-white/20"
                }
                ${plan.default ? "cursor-default" : "cursor-pointer"}
              `}
            >
              <div>
                {/* Badge / Tag */}
                {plan.badge && (
                  <div className="absolute top-6 right-6 bg-gradient-to-r from-emerald-500 to-teal-400 text-neutral-950 text-[10px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                    {plan.badge}
                  </div>
                )}

                {plan.default && (
                  <div className="absolute top-6 right-6 bg-white/5 text-zinc-400 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/10">
                    Active Free
                  </div>
                )}

                {/* Plan Header */}
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {plan.name}
                </h3>

                {/* Pricing / Credits block */}
                <div className="mt-6 pb-6 border-b border-white/10">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">
                      {plan.price}
                    </span>
                    <span className="text-xs text-zinc-550 font-medium">/ package</span>
                  </div>
                  
                  <div className='bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-3 py-1 rounded-lg text-xs font-semibold w-fit mt-3.5 flex items-center gap-1.5 shadow-sm'>
                    <span>⚡ {plan.credits} AI Credits</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-400 mt-6 text-sm leading-relaxed">
                  {plan.description}
                </p>

                {/* Features List */}
                <div className="mt-8 space-y-4 text-left">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="bg-emerald-500/10 border border-emerald-500/20 p-1 rounded-full mt-0.5 shadow-sm">
                        <FaCheck className="text-emerald-400 text-[9px]" />
                      </div>
                      <span className="text-zinc-350 text-xs sm:text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              {!plan.default && (
                <div className="mt-8 pt-4">
                  <button
                    disabled={loadingPlan === plan.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isSelected) {
                        setSelectedPlan(plan.id)
                      } else {
                        handlePayment(plan)
                      }
                    }} 
                    className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer active:scale-98
                      ${isSelected
                        ? "bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-neutral-950 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                        : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                      }
                    `}
                  >
                    {loadingPlan === plan.id
                      ? "Securing Payment..."
                      : isSelected
                        ? "Proceed to Purchase"
                        : "Select Plan"}
                  </button>
                </div>
              )}
            </Motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default Pricing
