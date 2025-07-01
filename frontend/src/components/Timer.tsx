import React, { useEffect, useState } from 'react'

interface Timmer {
    duration: number,
    setShowTimer: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Timer({ duration, setShowTimer }: Timmer) {
    const [time, setTime] = useState(duration)

    useEffect(() => {
        if(time === 0) {
            setShowTimer(false)
            return
        }

        const timer = setInterval(() => {
            setTime(prev => prev - 1)
        }, 1000)

        return () => {
            clearInterval(timer)
        }
    }, [time])

  return (
    <span>({time})</span>
  )
}
