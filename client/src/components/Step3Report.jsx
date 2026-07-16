import React from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from "motion/react"
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

function Step3Report({ report }) {
  const navigate = useNavigate()
  const Motion = motion

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading Report...</p>
      </div>
    );
  }
  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScore = [],
    skillGaps = [],
  } = report;

  const questionScoreData = questionWiseScore.map((score, index) => ({
    name: `Q${index + 1}`,
    score: score.score || 0
  }))

  const skills = [
    { label: "Confidence", value: confidence },
    { label: "Communication", value: communication },
    { label: "Correctness", value: correctness },
  ];

  let performanceText = "";
  let shortTagline = "";

  if (finalScore >= 8) {
    performanceText = "Ready for job opportunities.";
    shortTagline = "Excellent clarity and structured responses.";
  } else if (finalScore >= 5) {
    performanceText = "Needs minor improvement before interviews.";
    shortTagline = "Good foundation, refine articulation.";
  } else {
    performanceText = "Significant improvement required.";
    shortTagline = "Work on clarity and confidence.";
  }

  const score = finalScore;
  const percentage = (score / 10) * 100;


  const downloadPDF = () => {
  const doc = new jsPDF("p", "mm", "a4");

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  let currentY = 25;

  // ================= TITLE =================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(34, 197, 94);
  doc.text("AI Interview Performance Report", pageWidth / 2, currentY, {
    align: "center",
  });

  currentY += 5;

  // underline
  doc.setDrawColor(34, 197, 94);
  doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);

  currentY += 15;

  // ================= FINAL SCORE BOX =================
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(margin, currentY, contentWidth, 20, 4, 4, "F");

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(
    `Final Score: ${finalScore}/10`,
    pageWidth / 2,
    currentY + 12,
    { align: "center" }
  );

  currentY += 30;

  // ================= SKILLS BOX =================
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(margin, currentY, contentWidth, 30, 4, 4, "F");

  doc.setFontSize(12);

  doc.text(`Confidence: ${confidence}`, margin + 10, currentY + 10);
  doc.text(`Communication: ${communication}`, margin + 10, currentY + 18);
  doc.text(`Correctness: ${correctness}`, margin + 10, currentY + 26);

  currentY += 45;

  // ================= ADVICE =================
  let advice = "";

  if (finalScore >= 8) {
    advice =
      "Excellent performance. Maintain confidence and structure. Continue refining clarity and supporting answers with strong real-world examples.";
  } else if (finalScore >= 5) {
    advice =
      "Good foundation shown. Improve clarity and structure. Practice delivering concise, confident answers with stronger supporting examples.";
  } else {
    advice =
      "Significant improvement required. Focus on structured thinking, clarity, and confident delivery. Practice answering aloud regularly.";
  }

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(220);
  doc.roundedRect(margin, currentY, contentWidth, 35, 4, 4);

  doc.setFont("helvetica", "bold");
  doc.text("Professional Advice", margin + 10, currentY + 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  const splitAdvice = doc.splitTextToSize(advice, contentWidth - 20);
  doc.text(splitAdvice, margin + 10, currentY + 20);

  currentY += 50;

  // ================= QUESTION TABLE =================
  autoTable(doc, {
  startY: currentY,
  margin: { left: margin, right: margin },
  head: [["#", "Question", "Score", "Feedback"]],
  body: questionWiseScore.map((q, i) => [
    `${i + 1}`,
    q.question,
    `${q.score}/10`,
    `Feedback: ${q.feedback || ""}\n\nYour Answer:\n${q.answer || "N/A"}\n\nAI-Polished Response:\n${q.polishedAnswer || "N/A"}`,
  ]),
  styles: {
    fontSize: 9,
    cellPadding: 5,
    valign: "top",
  },
  headStyles: {
    fillColor: [34, 197, 94],
    textColor: 255,
    halign: "center",
  },
  columnStyles: {
    0: { cellWidth: 10, halign: "center" }, // index
    1: { cellWidth: 55 }, // question
    2: { cellWidth: 20, halign: "center" }, // score
    3: { cellWidth: "auto" }, // feedback
  },
  alternateRowStyles: {
    fillColor: [249, 250, 251],
  },
});


  doc.save("AI_Interview_Report.pdf");
};

  return (
    <div className='min-h-screen bg-[#060609] text-zinc-100 bg-grid-pattern px-4 sm:px-6 lg:px-10 py-10 relative overflow-hidden'>
      {/* Background ambient glows */}
      <div className="absolute top-[-10%] left-[-15%] w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-15%] w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[140px] pointer-events-none"></div>

      <div className='max-w-6xl mx-auto mb-10 relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6'>
        <div className='flex items-start gap-4 flex-wrap'>
          <button
            onClick={() => navigate("/history")}
            className='p-3.5 rounded-full bg-neutral-900/40 border border-white/10 shadow-md hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:bg-neutral-900 active:scale-95 transition-all cursor-pointer'
          >
            <FaArrowLeft className='text-neutral-300' size={14} />
          </button>

          <div>
            <h1 className='text-3xl font-extrabold tracking-tight text-white'>
              Assessment Dashboard
            </h1>
            <p className='text-zinc-400 text-xs sm:text-sm mt-1'>
              AI-generated performance analysis, metrics, and actionable advice
            </p>
          </div>
        </div>

        <button 
          onClick={downloadPDF} 
          className='bg-brand-500 hover:bg-brand-400 text-neutral-950 px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all duration-300 font-bold text-sm text-nowrap cursor-pointer active:scale-98'
        >
          Download PDF Report
        </button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10 items-start'>

        {/* Left Column: Scores & Skills */}
        <div className='space-y-6'>
          
          {/* Performance Circle Gauge */}
          <Motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass border border-white/5 rounded-3xl shadow-lg p-6 sm:p-8 text-center bg-neutral-900/30 backdrop-blur-md"
          >
            <h3 className="text-neutral-450 font-bold uppercase tracking-wider text-xs mb-6">
              Overall Performance
            </h3>
            
            <div className='relative w-24 h-24 sm:w-28 sm:h-28 mx-auto'>
              <CircularProgressbar
                value={percentage}
                text={`${score}/10`}
                styles={buildStyles({
                  textSize: "18px",
                  pathColor: "#10b981",
                  textColor: "#f4f4f5",
                  trailColor: "rgba(255, 255, 255, 0.05)",
                })}
              />
            </div>

            <p className="text-neutral-450 mt-4 text-xs font-semibold uppercase tracking-wider">
              Performance Index
            </p>

            <div className="mt-6 pt-4 border-t border-white/5">
              <p className="font-bold text-white text-sm sm:text-base">
                {performanceText}
              </p>
              <p className="text-zinc-400 text-xs sm:text-sm mt-1.5 leading-relaxed">
                {shortTagline}
              </p>
            </div>
          </Motion.div>

          {/* Skill Breakdown sliders */}
          <Motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='glass border border-white/5 rounded-3xl shadow-lg p-6 sm:p-8 bg-neutral-900/30 backdrop-blur-md'
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-450 mb-6">
              Core Skills Evaluation
            </h3>

            <div className='space-y-6'>
              {skills.map((s, i) => (
                <div key={i}>
                  <div className='flex justify-between mb-2 text-xs font-bold text-neutral-300 uppercase tracking-wider'>
                    <span>{s.label}</span>
                    <span className='text-brand-300'>{s.value}/10</span>
                  </div>

                  <div className='bg-neutral-950 h-2.5 rounded-full overflow-hidden border border-white/5'>
                    <div 
                      className='bg-brand-500 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                      style={{ width: `${s.value * 10}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Motion.div>

          {/* Skill Gaps Card */}
          {skillGaps && skillGaps.length > 0 && (
            <Motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className='glass border border-rose-500/20 rounded-3xl shadow-lg p-6 sm:p-8 bg-neutral-900/30 backdrop-blur-md relative overflow-hidden'
            >
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-rose-500/5 blur-xl pointer-events-none"></div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-450 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                Identified Skill Gaps (JD Match)
              </h3>
              <p className="text-zinc-400 text-xs mb-4 leading-relaxed">
                We matched your profile against the target job description and identified these focus areas:
              </p>
              <div className='flex flex-wrap gap-2'>
                {skillGaps.map((gap, i) => (
                  <span 
                    key={i} 
                    className='bg-rose-500/10 border border-rose-500/20 text-rose-300 px-3 py-1 rounded-xl text-xs font-medium transition-all duration-350 hover:bg-rose-500/20 shadow-xs'
                  >
                    {gap}
                  </span>
                ))}
              </div>
            </Motion.div>
          )}
        </div>

        {/* Right Column: Graphs & Detailed list */}
        <div className='lg:col-span-2 space-y-6'>

          {/* Performance AreaChart */}
          <Motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className='glass border border-white/5 rounded-3xl shadow-lg p-6 sm:p-8 bg-neutral-900/30 backdrop-blur-md'
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-450 mb-6">
              Question Score Trend
            </h3>

            <div className='h-64 sm:h-72 w-full'>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={questionScoreData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.03)" />
                  <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.3)" fontSize={11} tickLine={false} />
                  <YAxis domain={[0, 10]} stroke="rgba(255, 255, 255, 0.3)" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'rgba(10, 10, 15, 0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '12px', backdropFilter: 'blur(10px)' }} />
                  <Area 
                    type="monotone"
                    dataKey="score"
                    stroke="#10b981"
                    fill="url(#colorScore)"
                    strokeWidth={2.5} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Motion.div>

          {/* Question breakdown list */}
          <Motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='glass border border-white/5 rounded-3xl shadow-lg p-6 sm:p-8 bg-neutral-900/30 backdrop-blur-md'
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-450 mb-6">
              Question-by-Question breakdown
            </h3>
            
            <div className='space-y-5'>
              {questionWiseScore.map((q, i) => (
                <div key={i} className='bg-neutral-950/40 p-5 rounded-2xl border border-white/5 space-y-4 hover:border-brand-500/20 transition-all duration-300'>

                  <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3.5'>
                    <div>
                      <span className="bg-neutral-900/60 text-zinc-400 border border-white/5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                        Task 0{i + 1}
                      </span>
                      
                      <p className="font-bold text-white text-sm sm:text-base leading-relaxed mt-2">
                        {q.question || "Question prompt missing"}
                      </p>
                    </div>

                    <div className='bg-brand-500/10 text-brand-300 border border-brand-500/20 px-3.5 py-1 rounded-full font-extrabold text-xs sm:text-sm w-fit shadow-xs'>
                      {q.score ?? 0}/10
                    </div>
                  </div>

                  <div className='bg-neutral-950/60 border border-white/5 p-4 rounded-xl shadow-inner'>
                    <span className='text-[10px] text-brand-300 font-bold uppercase tracking-wider block mb-1'>
                      AI Reviewer Feedback
                    </span>
                    <p className='text-xs sm:text-sm text-zinc-400 leading-relaxed italic'>
                      "{q.feedback && q.feedback.trim() !== ""
                        ? q.feedback
                        : "No qualitative evaluation comments provided."}"
                    </p>
                  </div>

                  {q.answer && (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-3'>
                      {/* Raw Answer */}
                      <div className='bg-neutral-950/40 border border-white/5 p-4 rounded-xl shadow-inner'>
                        <span className='text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mb-1.5'>
                          Your Answer
                        </span>
                        <p className='text-xs sm:text-sm text-zinc-300 leading-relaxed'>
                          {q.answer}
                        </p>
                      </div>

                      {/* AI-Polished Version */}
                      <div className='bg-emerald-500/[0.03] border border-emerald-500/10 p-4 rounded-xl shadow-inner relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-350'>
                        <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-300 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-bl-lg border-l border-b border-emerald-500/10">
                          Top 1% Articulation
                        </div>
                        <span className='text-[10px] text-emerald-300 font-bold uppercase tracking-wider block mb-1.5'>
                          AI-Polished Response
                        </span>
                        <p className='text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-medium'>
                          {q.polishedAnswer || "No polished response generated."}
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>
          </Motion.div>

        </div>
      </div>
    </div>
  )
}

export default Step3Report
