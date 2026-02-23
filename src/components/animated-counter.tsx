"use client"

import { useState, useEffect, useRef } from "react"
import { useInView } from "framer-motion"

export default function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
  suffix = "",
}: {
  from?: number
  to: number
  duration?: number
  suffix?: string
}) {
  const [count, setCount] = useState(from)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  useEffect(() => {
    if (isInView) {
      const stepTime = Math.abs(Math.floor((duration * 1000) / (to - from)))
      let current = from
      const timer = setInterval(() => {
        current += Math.ceil((to - from) / 40)
        if (current >= to) {
          setCount(to)
          clearInterval(timer)
        } else {
          setCount(current)
        }
      }, stepTime)
      return () => clearInterval(timer)
    }
  }, [isInView, from, to, duration])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}
