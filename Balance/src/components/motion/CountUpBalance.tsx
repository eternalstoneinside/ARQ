import { animate, useMotionValue, useMotionValueEvent, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { formatMoneyParts } from '../../lib/format'

export function CountUpBalance({ minor }: { minor: number }) {
  const reduceMotion = useReducedMotion()
  const value = useMotionValue(reduceMotion ? minor : 0)
  const [parts, setParts] = useState(() => formatMoneyParts(reduceMotion ? minor : 0))

  useMotionValueEvent(value, 'change', (latest) => {
    setParts(formatMoneyParts(Math.round(latest)))
  })

  useEffect(() => {
    if (reduceMotion) {
      value.set(minor)
      return
    }

    const controls = animate(value, minor, {
      type: 'spring',
      stiffness: 95,
      damping: 24,
      mass: 0.9,
      restDelta: 1,
    })

    return () => controls.stop()
  }, [minor, reduceMotion, value])

  return (
    <>
      <span>{parts.number}</span>
      <small>{parts.currency}</small>
    </>
  )
}
