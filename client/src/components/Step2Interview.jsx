/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import React from 'react'
import maleVideo from "../assets/videos/male-ai.mp4"
import femaleVideo from "../assets/videos/female-ai.mp4"
import Timer from './Timer'
import { motion as Motion } from "motion/react"
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import axios from "axios"
import { ServerUrl } from '../config'
import { BsArrowRight } from 'react-icons/bs'

function Step2Interview({ interviewData, onFinish }) {
  const { interviewId, questions, userName } = interviewData;
  const [isIntroPhase, setIsIntroPhase] = useState(true);

  const [isMicOn, setIsMicOn] = useState(true);
  const recognitionRef = useRef(null);
  const [isAIPlaying, setIsAIPlaying] = useState(false);

  // ✅ Proctoring States & Refs
  const [warnings, setWarnings] = useState(0);
  const [isViolationOverlay, setIsViolationOverlay] = useState(false);
  const [isTerminated, setIsTerminated] = useState(false);
  const [hasEnteredFullscreen, setHasEnteredFullscreen] = useState(false);

  const isViolationRef = useRef(false);
  const isTerminatedRef = useRef(false);

  // ✅ Refs to avoid stale closures in recognition callbacks
  const isMicOnRef = useRef(true);
  const isAIPlayingRef = useRef(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(
    questions[0]?.timeLimit || 60
  );
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");
  const [interimText, setInterimText] = useState(""); // ✅ live interim display
  const isRecognizingRef = useRef(false); // ✅ track karo recognition chal rahi hai ya nahi
  const finalAnswerRef = useRef(""); // ✅ final confirmed text track karne ke liye

  const videoRef = useRef(null);
  const currentQuestion = questions[currentIndex];

  // ✅ Camera & Tech Check States & Refs
  const [userStream, setUserStream] = useState(null);
  const [isTechCheckPassed, setIsTechCheckPassed] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  
  const userCameraPreviewRef = useRef(null);
  const userCameraThumbnailRef = useRef(null);

  // ✅ Live Mic Volume States & Refs
  const [micVolume, setMicVolume] = useState(0);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameIdRef = useRef(null);

  // ✅ Proctoring Handlers
  const triggerViolation = (reason) => {
    console.log("Proctoring violation:", reason);
    if (isViolationRef.current || isTerminated || isTerminatedRef.current) return;

    // Pause mic recognition
    stopMic();
    
    // Pause speech synthesis & video avatar
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
    videoRef.current?.pause();

    const nextWarnings = warnings + 1;
    setWarnings(nextWarnings);

    isViolationRef.current = true;

    if (nextWarnings >= 3) {
      setIsTerminated(true);
      isTerminatedRef.current = true;
      setIsViolationOverlay(false);
      isViolationRef.current = false;
      window.speechSynthesis.cancel();
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    } else {
      setIsViolationOverlay(true);
    }
  };

  const resumeFromViolation = () => {
    setIsViolationOverlay(false);
    isViolationRef.current = false;
    
    // Request fullscreen again
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen().catch(() => {});
    }

    // Resume speech synthesis & video
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      videoRef.current?.play();
    } else {
      if (isMicOnRef.current && !isAIPlayingRef.current) {
        startMic();
      }
    }
  };

  const enterFullscreenMode = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen().catch((err) => {
        console.log("Error entering fullscreen:", err);
      });
    }
    setHasEnteredFullscreen(true);
  };

  // ✅ Tech Check Device Access Request
  const requestDevicesAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true
      });
      setUserStream(stream);
      if (userCameraPreviewRef.current) {
        userCameraPreviewRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing devices:", err);
    }
  };

  const handleTechCheckSubmit = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      setIsTechCheckPassed(true);
    }, 400); // 400ms flash duration
  };

  // ✅ Helper to sync both state and ref together
  const setMicOn = (val) => {
    isMicOnRef.current = val;
    setIsMicOn(val);
  };

  const setAIPlaying = (val) => {
    isAIPlayingRef.current = val;
    setIsAIPlaying(val);
  };

  function startMic() {
    if (recognitionRef.current && !isAIPlayingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current.start();
      } catch {
        // ignore error
      }
    }
  }

  function stopMic() {
    if (recognitionRef.current && isRecognizingRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore error
      }
    }
  }

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      const femaleVoice =
        voices.find(v =>
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("female")
        );

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }

      const maleVoice =
        voices.find(v =>
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("mark") ||
          v.name.toLowerCase().includes("male")
        );

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }

      setSelectedVoice(voices[0]);
      setVoiceGender("female");
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;


  /* ---------------- SPEAK FUNCTION ---------------- */
  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      const humanText = text
        .replace(/,/g, ", ... ")
        .replace(/\./g, ". ... ");

      const utterance = new SpeechSynthesisUtterance(humanText);
      utterance.voice = selectedVoice;
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      utterance.onstart = () => {
        setAIPlaying(true); // ✅ updates both state and ref
        stopMic();
        videoRef.current?.play();
      };

      utterance.onend = () => {
        videoRef.current?.pause();
        videoRef.current.currentTime = 0;
        setAIPlaying(false); // ✅ updates both state and ref

        if (isMicOnRef.current) {
          startMic();
        }
        setTimeout(() => {
          setSubtitle("");
          resolve();
        }, 300);
      };

      setSubtitle(text);
      window.speechSynthesis.speak(utterance);
    });
  };


  useEffect(() => {
    if (!selectedVoice) return;
    if (!hasEnteredFullscreen || !isTechCheckPassed) return; // ✅ Wait for proctoring & camera check

    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(
          `Hi ${userName}, it's great to meet you today. I hope you're feeling confident and ready.`
        );
        await speakText(
          "I'll ask you a few questions. Just answer naturally, and take your time. Let's begin."
        );
        setIsIntroPhase(false);
      } else if (currentQuestion) {
        await new Promise(r => setTimeout(r, 800));

        if (currentIndex === questions.length - 1) {
          await speakText("Alright, this one might be a bit more challenging.");
        }

        await speakText(currentQuestion.question);

        if (isMicOnRef.current) {
          startMic();
        }
      }
    };

    runIntro();
  }, [selectedVoice, isIntroPhase, currentIndex, hasEnteredFullscreen, isTechCheckPassed]);


  useEffect(() => {
    if (isIntroPhase || isViolationOverlay || isTerminated || isAIPlaying) return;
    if (!currentQuestion) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isIntroPhase, currentIndex, isViolationOverlay, isTerminated, isAIPlaying]);


  useEffect(() => {
    if (!isIntroPhase && currentQuestion) {
      setTimeLeft(currentQuestion.timeLimit || 60);
    }
  }, [currentIndex]);


  // ✅ Speech Recognition setup with interimResults, onerror, and onend restart
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true; // ✅ Real-time catch

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        finalAnswerRef.current = (finalAnswerRef.current + " " + finalTranscript).trim();
        setAnswer(finalAnswerRef.current);
        setInterimText("");
      } else if (interimTranscript) {
        setInterimText(interimTranscript);
      }
    };

    recognition.onstart = () => {
      isRecognizingRef.current = true;
    };

    recognition.onerror = (event) => {
      console.log("Recognition error:", event.error);
      isRecognizingRef.current = false;

      const delay = event.error === "network" ? 2000 : 300;

      setTimeout(() => {
        if (isMicOnRef.current && !isAIPlayingRef.current && !isRecognizingRef.current && !isViolationRef.current && !isTerminatedRef.current) {
          try {
            recognition.start();
          } catch {
            // ignore error
          }
        }
      }, delay);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      if (isMicOnRef.current && !isAIPlayingRef.current && !isViolationRef.current && !isTerminatedRef.current) {
        setTimeout(() => {
          if (!isRecognizingRef.current) {
            try {
              recognition.start();
            } catch {
              // ignore error
            }
          }
        }, 100);
      }
    };

    recognitionRef.current = recognition;
  }, []);


  const toggleMic = () => {
    if (isMicOnRef.current) {
      stopMic();
      setMicOn(false);
    } else {
      startMic();
      setMicOn(true);
    }
  };


  const submitAnswer = async () => {
    if (isSubmitting) return;
    stopMic();
    setIsSubmitting(true);

    try {
      const result = await axios.post(ServerUrl + "/api/interview/submit-answer", {
        interviewId,
        questionIndex: currentIndex,
        answer,
        timeTaken: currentQuestion.timeLimit - timeLeft,
      }, { withCredentials: true });

      setFeedback(result.data.feedback);
      speakText(result.data.feedback);
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    setAnswer("");
    setFeedback("");
    setInterimText("");
    finalAnswerRef.current = "";

    if (currentIndex + 1 >= questions.length) {
      finishInterview();
      return;
    }

    await speakText("Alright, let's move to the next question.");
    setCurrentIndex(currentIndex + 1);

    setTimeout(() => {
      if (isMicOnRef.current) startMic();
    }, 500);
  };

  const finishInterview = async () => {
    stopMic();
    setMicOn(false);
    try {
      const result = await axios.post(ServerUrl + "/api/interview/finish", { interviewId }, { withCredentials: true });
      console.log(result.data);
      onFinish(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;

    if (timeLeft === 0 && !isSubmitting && !feedback) {
      submitAnswer();
    }
  }, [timeLeft]);

  // ✅ Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  // ✅ Auto-Request Camera/Mic stream when Tech Check launches
  useEffect(() => {
    if (hasEnteredFullscreen && !isTechCheckPassed && !userStream) {
      requestDevicesAccess();
    }
  }, [hasEnteredFullscreen, isTechCheckPassed, userStream]);

  // ✅ Bind camera stream to the preview video on Tech Check once it mounts
  useEffect(() => {
    if (hasEnteredFullscreen && !isTechCheckPassed && userStream && userCameraPreviewRef.current) {
      userCameraPreviewRef.current.srcObject = userStream;
    }
  }, [hasEnteredFullscreen, isTechCheckPassed, userStream]);

  // ✅ Bind camera stream to the overlay thumbnail once interview starts
  useEffect(() => {
    if (isTechCheckPassed && userStream && userCameraThumbnailRef.current) {
      userCameraThumbnailRef.current.srcObject = userStream;
    }
  }, [isTechCheckPassed, userStream]);

  // ✅ Clean up user camera tracks on unmount
  useEffect(() => {
    return () => {
      if (userStream) {
        userStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [userStream]);

  // ✅ Audio analyzer for real-time mic volume tracking during tech check
  useEffect(() => {
    if (!hasEnteredFullscreen || isTechCheckPassed || !userStream) return;

    const audioTracks = userStream.getAudioTracks();
    if (audioTracks.length === 0) return;

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContextClass();
      const source = audioContext.createMediaStreamSource(userStream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        let values = 0;
        for (let i = 0; i < bufferLength; i++) {
          values += dataArray[i];
        }
        const average = values / bufferLength;
        const percent = Math.min(Math.round((average / 120) * 100), 100);
        setMicVolume(percent);

        animationFrameIdRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (err) {
      console.error("Error setting up audio analyzer:", err);
    }

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
      audioContextRef.current = null;
      analyserRef.current = null;
      setMicVolume(0);
    };
  }, [hasEnteredFullscreen, isTechCheckPassed, userStream]);

  // ✅ Proctoring Listeners
  useEffect(() => {
    if (!hasEnteredFullscreen || isTerminated || isTerminatedRef.current) return;

    const handleFullscreenChange = () => {
      const isFullscreen = document.fullscreenElement || 
                           document.webkitFullscreenElement || 
                           document.mozFullScreenElement || 
                           document.msFullscreenElement;
      
      if (!isFullscreen && !isTerminated && !isTerminatedRef.current) {
        triggerViolation("Fullscreen exited");
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && !isTerminated && !isTerminatedRef.current) {
        triggerViolation("Tab switched or window minimized");
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("msfullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [hasEnteredFullscreen, isTerminated, warnings, isViolationOverlay]);


  // 1. Proctoring Fullscreen Entry view
  if (!hasEnteredFullscreen) {
    return (
      <div className='min-h-screen bg-[#060609] text-zinc-100 bg-grid-pattern flex items-center justify-center p-4 relative select-none'>
        <div className="absolute top-[-10%] left-[-15%] w-[600px] h-[600px] rounded-full bg-brand-500/5 blur-[130px] pointer-events-none"></div>
        <div className='w-full max-w-md bg-neutral-900/40 border border-white/10 p-8 rounded-3xl backdrop-blur-xl text-center space-y-6 shadow-2xl relative z-10'>
          <div className="w-16 h-16 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto text-brand-300">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight">Proctoring Mode Enabled</h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
              To simulate a real interview environment, this session will run in **Fullscreen Mode**. Please do not switch tabs, minimize, or exit fullscreen. You have up to 3 warnings before session termination.
            </p>
          </div>
          <button
            onClick={enterFullscreenMode}
            className='w-full bg-gradient-to-r from-[#10b981] to-teal-400 hover:from-emerald-450 hover:to-teal-355 text-neutral-950 py-3.5 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all font-bold text-sm tracking-wide cursor-pointer'
          >
            Enter Fullscreen & Start
          </button>
        </div>
      </div>
    );
  }

  // 2. Tech Check / Webcam Setup & Calibration view
  if (hasEnteredFullscreen && !isTechCheckPassed) {
    return (
      <div className='min-h-screen bg-[#060609] text-zinc-100 bg-grid-pattern flex flex-col items-center justify-center p-4 relative select-none'>
        <div className="absolute top-[-10%] left-[-15%] w-[600px] h-[600px] rounded-full bg-brand-500/5 blur-[130px] pointer-events-none"></div>
        
        <div className='w-full max-w-3xl bg-neutral-900/35 rounded-3xl shadow-2xl border border-white/10 p-6 sm:p-8 backdrop-blur-xl flex flex-col md:flex-row gap-6 relative z-10 overflow-hidden'>
          {isCapturing && (
            <div className="absolute inset-0 bg-white z-50 pointer-events-none rounded-3xl" style={{ animation: 'flash 0.4s ease-out forwards' }}>
              <style>{`
                @keyframes flash {
                  0% { opacity: 1; }
                  100% { opacity: 0; }
                }
              `}</style>
            </div>
          )}

          {/* Left Panel: Live camera stream */}
          <div className="flex-1 flex flex-col items-center space-y-4">
            <h2 className="text-lg font-black text-white tracking-tight self-start">Camera Calibration</h2>
            <div className='w-full aspect-video rounded-2xl overflow-hidden border border-white/10 relative bg-neutral-950 flex items-center justify-center shadow-lg'>
              {userStream ? (
                <video
                  ref={userCameraPreviewRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              ) : (
                <div className="text-center space-y-3 p-4">
                  <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-zinc-400 text-xs">Requesting camera & microphone access...</p>
                </div>
              )}
            </div>

            <div className="w-full flex flex-col gap-3 bg-neutral-950/40 border border-white/5 p-4 rounded-xl">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-zinc-550 uppercase tracking-wider">Device Status</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-zinc-350">
                    <span className={`w-2 h-2 rounded-full ${userStream ? 'bg-brand-500 animate-pulse' : 'bg-rose-500'}`}></span>
                    Camera
                  </span>
                  <span className="flex items-center gap-1.5 text-zinc-350">
                    <span className={`w-2 h-2 rounded-full ${userStream ? 'bg-brand-500 animate-pulse' : 'bg-rose-500'}`}></span>
                    Microphone
                  </span>
                </div>
              </div>

              {/* Live Mic Activity Wave */}
              {userStream && (
                <div className="flex flex-col gap-1.5 pt-1.5 border-t border-white/5">
                  <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400">
                    <span className="uppercase tracking-wider">Microphone Input Level</span>
                    <span className="text-brand-300 font-mono">{micVolume}%</span>
                  </div>
                  <div className="flex items-center gap-1 h-7 pt-1 justify-center w-full bg-neutral-900/50 rounded-lg px-2">
                    {Array.from({ length: 24 }).map((_, idx) => {
                      const factor = Math.sin((idx / 23) * Math.PI);
                      const barHeight = Math.max(4, Math.round(micVolume * 0.22 * factor));
                      return (
                        <div
                          key={idx}
                          className="w-1 rounded-full bg-brand-500 transition-all duration-75 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                          style={{
                            height: `${barHeight}px`,
                            opacity: micVolume > 0 ? 0.3 + (barHeight / 22) * 0.7 : 0.25
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Check details */}
          <div className="w-full md:w-[40%] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="bg-brand-500/10 text-brand-300 border border-brand-500/20 text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full">
                  Device Setup
                </span>
                <h3 className="text-lg font-black text-white tracking-tight pt-2">Verify Settings</h3>
              </div>
              
              <div className="space-y-3 text-xs sm:text-sm text-zinc-400">
                <div className="flex items-start gap-2.5">
                  <span className="text-brand-300 font-bold">1.</span>
                  <p>Center your face inside the frame and keep eye contact with the AI.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-brand-300 font-bold">2.</span>
                  <p>Check that your lighting is bright enough and background is professional.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="text-brand-300 font-bold">3.</span>
                  <p>We will take a quick verification snapshot to initialize the session.</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleTechCheckSubmit}
              disabled={!userStream}
              className='w-full disabled:bg-neutral-900 disabled:text-neutral-750 disabled:border-none disabled:shadow-none bg-gradient-to-r from-[#10b981] to-teal-400 hover:from-emerald-450 hover:to-teal-355 text-neutral-950 py-3.5 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all font-black text-xs uppercase tracking-wider cursor-pointer text-center'
            >
              Take Snapshot & Start
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Main Active Interview view
  return (
    <div className='min-h-screen lg:h-screen lg:overflow-hidden bg-[#060609] text-zinc-100 bg-grid-pattern flex items-center justify-center p-3 sm:p-4 lg:p-6 relative select-none'>
      {/* Background ambient glows */}
      <div className="absolute top-[-10%] left-[-15%] w-[600px] h-[600px] rounded-full bg-brand-500/5 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-15%] w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[130px] pointer-events-none"></div>

      <div className='w-full max-w-6xl h-full lg:h-[85vh] xl:h-[82vh] bg-neutral-900/35 rounded-3xl shadow-2xl border border-white/10 flex flex-col lg:flex-row overflow-hidden relative z-10 backdrop-blur-xl'>

        {/* Video / Status Section */}
        <div className='w-full lg:w-[35%] bg-neutral-950/60 flex flex-col items-center p-4 lg:p-5 justify-between space-y-4 lg:space-y-0 border-r border-white/5 lg:h-full lg:overflow-hidden'>
          
          {/* Top content wrapper (Video) */}
          <div className="w-full flex flex-col items-center space-y-3 flex-shrink-0">
            {/* Avatar Video Block */}
            <div className='w-full max-w-sm rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.15)] border border-white/10 relative bg-neutral-900 group aspect-video flex items-center justify-center flex-shrink-0'>
              <video
                src={videoSource}
                key={videoSource}
                ref={videoRef}
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-cover"
              />
              {/* Status indicators overlaid on video */}
              <div className="absolute top-3 left-3 bg-neutral-900/80 backdrop-blur-md border border-white/10 text-white px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <span className={`w-2 h-2 rounded-full ${isAIPlaying ? 'bg-brand-500 animate-pulse' : 'bg-neutral-400'}`}></span>
                <span>AI Interviewer</span>
              </div>

              {/* Subtitles Overlay inside Video Container */}
              {subtitle && (
                <Motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='absolute bottom-3 left-3 right-3 bg-neutral-950/80 border border-white/10 rounded-xl p-2.5 shadow-lg backdrop-blur-md text-center max-h-[85px] overflow-y-auto'
                >
                  <p className='text-zinc-200 text-[10px] sm:text-xs font-semibold leading-relaxed italic'>
                    "{subtitle}"
                  </p>
                </Motion.div>
              )}
            </div>
          </div>

          {/* User Camera Block (Symmetrical card in the blank space) */}
          {userStream && (
            <div className='w-full max-w-sm aspect-video rounded-2xl overflow-hidden border border-white/10 relative bg-neutral-950/60 shadow-lg flex-shrink-0'>
              <video
                ref={userCameraThumbnailRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
              <div className="absolute top-3 left-3 bg-neutral-900/80 backdrop-blur-md border border-white/10 text-white px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></span>
                <span>Candidate (You)</span>
              </div>
            </div>
          )}

          {/* Setup / Timer stats card */}
          <div className='w-full max-w-sm bg-neutral-950/40 border border-white/5 rounded-2xl shadow-lg p-4 lg:p-5 space-y-4 lg:space-y-0 flex-shrink-0'>
            <div className='flex justify-between items-center text-xs font-bold uppercase tracking-wider text-zinc-500'>
              <span>Interview Timeline</span>
              {isAIPlaying ? (
                <span className='text-brand-300 flex items-center gap-1'>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-500 animate-ping"></span> AI speaking
                </span>
              ) : (
                <span className="text-zinc-400">Your Response</span>
              )}
            </div>

            <div className="h-px bg-white/5 my-3 sm:my-4"></div>

            <div className='flex justify-center py-2'>
              <Timer timeLeft={timeLeft} totalTime={currentQuestion?.timeLimit} />
            </div>

            <div className="h-px bg-white/5 my-3 sm:my-4"></div>

            <div className='grid grid-cols-2 gap-4 text-center'>
              <div className="border-r border-white/5">
                <span className='text-2xl font-extrabold text-brand-300 block'>{currentIndex + 1}</span>
                <span className='text-[10px] text-zinc-500 font-bold uppercase tracking-wider'>Current</span>
              </div>
              <div>
                <span className='text-2xl font-extrabold text-zinc-100 block'>{questions.length}</span>
                <span className='text-[10px] text-zinc-500 font-bold uppercase tracking-wider'>Total Tasks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Text Area & Input Section */}
        <div className='flex-1 flex flex-col p-4 sm:p-5 lg:p-6 relative bg-transparent lg:h-full justify-between min-w-0'>
          
          <div className="w-full flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-300">Active Simulation</span>
              <span className="text-xs text-zinc-400 font-semibold">{userName}</span>
            </div>

            {/* Question Card */}
            {!isIntroPhase && (
              <Motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className='relative mb-4 bg-brand-500/[0.05] p-4 rounded-2xl border border-brand-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)] max-h-[140px] overflow-y-auto'
              >
                <p className="text-[10px] font-bold text-brand-300 uppercase tracking-wider mb-1.5">
                  Question {currentIndex + 1} of {questions.length}
                </p>
                <div className='text-xs sm:text-sm font-bold text-white leading-relaxed'>
                  {currentQuestion?.question}
                </div>
              </Motion.div>
            )}
          </div>

          {/* Response Textarea & indicators */}
          <div className="flex-1 flex flex-col min-h-0 relative mb-4">
            <textarea
              placeholder="Your answer will appear here dynamically as you speak, or you can type directly..."
              onChange={(e) => {
                setAnswer(e.target.value);
                finalAnswerRef.current = e.target.value; 
              }}
              value={answer + (interimText ? " " + interimText : "")}
              className="flex-1 w-full bg-neutral-950/50 hover:bg-neutral-950/80 p-4 rounded-2xl resize-none outline-none border border-white/10 focus:ring-1 focus:ring-brand-500 focus:border-brand-500 focus:bg-neutral-950 transition-all text-zinc-150 text-xs sm:text-sm leading-relaxed h-full min-h-0"
            />
            
            {/* Live mic transcript label */}
            {isMicOn && !isAIPlaying && (
              <div className="absolute bottom-4 left-4 bg-brand-500/10 border border-brand-500/20 px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-brand-300 uppercase tracking-wider">🎙 Listening Live</span>
              </div>
            )}
          </div>

          {/* Controls Footer */}
          {!feedback ? (
            <div className='w-full flex-shrink-0 flex items-center gap-4 pt-4 border-t border-white/5'>
              <Motion.button
                onClick={toggleMic}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md cursor-pointer transition-all duration-200 active:scale-95 flex-shrink-0
                  ${isMicOn 
                    ? "bg-red-500 hover:bg-red-650 text-white ring-4 ring-red-500/10" 
                    : "bg-neutral-800 hover:bg-neutral-700 text-zinc-100 border border-white/5"
                  }
                `}
                title={isMicOn ? "Turn Mic Off" : "Turn Mic On"}
              >
                {isMicOn ? <FaMicrophone size={18} /> : <FaMicrophoneSlash size={18} />}
              </Motion.button>

              <Motion.button
                onClick={submitAnswer}
                disabled={isSubmitting}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className='flex-1 disabled:bg-neutral-900 disabled:text-neutral-750 disabled:border-none bg-brand-500 hover:bg-brand-400 text-neutral-950 py-3 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-300 font-bold text-xs sm:text-sm tracking-wide cursor-pointer'
              >
                {isSubmitting ? "Submitting Response..." : "Submit Answer"}
              </Motion.button>
            </div>
          ) : (
            <Motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className='w-full flex-shrink-0 bg-brand-500/5 border border-brand-500/20 p-4 rounded-2xl shadow-lg max-h-[150px] overflow-y-auto'
            >
              <div className="mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-300 block mb-1">Interviewer Feedback</span>
                <p className='text-zinc-200 font-medium text-xs leading-relaxed'>{feedback}</p>
              </div>

              <button
                onClick={handleNext}
                className='w-full bg-brand-500 hover:bg-brand-400 text-neutral-950 py-2.5 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-colors font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer active:scale-99'
              >
                <span>{currentIndex + 1 === questions.length ? "Finish Assessment" : "Next Question"}</span>
                <BsArrowRight size={14} />
              </button>
            </Motion.div>
          )}
        </div>
      </div>

      {/* Violation Overlay */}
      {isViolationOverlay && (
        <div className='absolute inset-0 z-50 bg-[#060609]/95 backdrop-blur-xl flex items-center justify-center p-4 select-none'>
          <div className='w-full max-w-md bg-neutral-900/40 border border-rose-500/20 p-8 rounded-3xl backdrop-blur-xl text-center space-y-6 shadow-2xl relative z-10 animate-fade-in'>
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-450 animate-bounce">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <div className="space-y-2">
              <span className="bg-rose-500/10 text-rose-300 border border-rose-500/20 text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full">
                Warning {warnings} of 3
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight pt-2">Proctoring Violation</h2>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                Tab switching, window minimization, or exiting fullscreen mode is strictly prohibited. Please return to fullscreen to resume your assessment.
              </p>
            </div>

            <button
              onClick={resumeFromViolation}
              className='w-full bg-gradient-to-r from-[#10b981] to-teal-400 hover:from-emerald-450 hover:to-teal-355 text-neutral-950 py-3.5 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all font-bold text-sm tracking-wide cursor-pointer'
            >
              Resume Interview
            </button>
          </div>
        </div>
      )}

      {/* Session Terminated Overlay */}
      {isTerminated && (
        <div className='absolute inset-0 z-50 bg-[#060609]/98 backdrop-blur-xl flex items-center justify-center p-4 select-none'>
          <div className='w-full max-w-md bg-neutral-900/40 border border-red-500/30 p-8 rounded-3xl backdrop-blur-xl text-center space-y-6 shadow-2xl relative z-10 animate-fade-in'>
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-550">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            
            <div className="space-y-2">
              <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full">
                Session Terminated
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight pt-2">Interview Auto-Terminated</h2>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                This session has been terminated due to multiple proctoring violations (exiting fullscreen or tab switching). You can view the partial assessment results in your history.
              </p>
            </div>

            <button
              onClick={finishInterview}
              className='w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-450 hover:to-rose-500 text-white py-3.5 rounded-2xl shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all font-bold text-sm tracking-wide cursor-pointer'
            >
              End Session & View Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Step2Interview;
