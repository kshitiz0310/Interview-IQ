import React from 'react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function Timer({ timeLeft, totalTime }) {
    const percentage = (timeLeft/totalTime)*100
  return (
    <div className='w-20 h-20 shadow-2xs rounded-full p-1 bg-white border border-neutral-100'>
        <CircularProgressbar
        value={percentage}
        text={`${timeLeft}s`}
        styles={buildStyles({
          textSize: "28px",
          pathColor: "#22c55e",
          textColor: "#18181b",
          trailColor: "#f4f4f5",
        })}
        />
    </div>
  )
}

export default Timer
