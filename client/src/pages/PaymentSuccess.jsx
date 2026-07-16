import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion as Motion } from "motion/react"
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'
import axios from 'axios'
import { ServerUrl } from '../config'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [status, setStatus] = useState("verifying") // verifying, success, error
  const [errorMessage, setErrorMessage] = useState("")
  const isVerifyingRef = useRef(false)

  useEffect(() => {
    if (!sessionId) {
      setStatus("error")
      setErrorMessage("No session ID found in redirect URL.")
      return
    }

    // Avoid duplicate verification requests in React Strict Mode
    if (isVerifyingRef.current) return
    isVerifyingRef.current = true

    const verifyCheckoutPayment = async () => {
      try {
        const response = await axios.post(
          ServerUrl + "/api/payment/verify",
          { session_id: sessionId },
          { withCredentials: true }
        )

        if (response.data && response.data.success) {
          dispatch(setUserData(response.data.user))
          setStatus("success")
        } else {
          throw new Error(response.data.message || "Failed to verify transaction.")
        }
      } catch (error) {
        console.error("Payment verification error:", error)
        setStatus("error")
        setErrorMessage(
          error.response?.data?.message || error.message || "Failed to verify payment status."
        )
      }
    }

    verifyCheckoutPayment()
  }, [sessionId, dispatch])

  return (
    <div className='min-h-screen bg-[#030307] text-zinc-100 bg-grid-pattern flex items-center justify-center p-6 relative select-none'>
      {/* Background ambient glows */}
      <div className="absolute top-[-10%] left-[-15%] w-[600px] h-[600px] rounded-full bg-brand-500/5 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-15%] w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[130px] pointer-events-none"></div>

      <div className='w-full max-w-md bg-neutral-900/35 border border-white/10 p-8 rounded-3xl backdrop-blur-xl text-center space-y-6 shadow-2xl relative z-10'>
        {status === "verifying" && (
          <div className="space-y-6 py-6">
            <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-white tracking-tight">Verifying Payment</h2>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                Confirming transaction status with Stripe secure network. Please do not close or refresh this window.
              </p>
            </div>
          </div>
        )}

        {status === "success" && (
          <Motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto text-brand-300">
              <FaCheckCircle size={36} className="animate-bounce" />
            </div>

            <div className="space-y-2">
              <span className="bg-brand-500/10 text-brand-300 border border-brand-500/20 text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full">
                Payment Success
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight pt-2">Credits Added 🎉</h2>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                Your payment was secure and verified. The interview credits have been credited to your profile. Let's start practicing!
              </p>
            </div>

            <button
              onClick={() => navigate("/")}
              className='w-full bg-gradient-to-r from-[#10b981] to-teal-400 hover:from-emerald-450 hover:to-teal-355 text-neutral-950 py-3.5 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all font-bold text-xs uppercase tracking-wider cursor-pointer'
            >
              Go to Dashboard
            </button>
          </Motion.div>
        )}

        {status === "error" && (
          <Motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
              <FaExclamationCircle size={36} className="animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full">
                Verification Failed
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight pt-2">Something Went Wrong</h2>
              <p className="text-rose-350/80 text-xs leading-relaxed max-w-xs mx-auto">
                {errorMessage || "We couldn't confirm your transaction. If credits weren't added, please reach out to support."}
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate("/pricing")}
                className='flex-1 bg-neutral-800 hover:bg-neutral-700 text-zinc-150 border border-white/5 py-3 rounded-2xl transition-all font-bold text-xs uppercase tracking-wider cursor-pointer'
              >
                Back to Pricing
              </button>
              <button
                onClick={() => navigate("/")}
                className='flex-1 bg-gradient-to-r from-emerald-500 to-teal-400 text-neutral-950 py-3 rounded-2xl transition-all font-bold text-xs uppercase tracking-wider cursor-pointer'
              >
                Go Home
              </button>
            </div>
          </Motion.div>
        )}
      </div>
    </div>
  )
}

export default PaymentSuccess
