import { motion, type HTMLMotionProps } from 'framer-motion'
import { ArqWordmark } from '../brand/ArqWordmark'
import { sharedTransition } from '../../motion/motionTokens'

type MotionWordmarkProps = Omit<HTMLMotionProps<'div'>, 'children' | 'className'> & {
  className?: string
  wordmarkClassName?: string
}

export function MotionWordmark({ className = '', wordmarkClassName = '', ...props }: MotionWordmarkProps) {
  return (
    <motion.div
      className={`motion-wordmark ${className}`.trim()}
      layoutId="arq-wordmark"
      transition={sharedTransition}
      {...props}
    >
      <ArqWordmark className={wordmarkClassName} />
    </motion.div>
  )
}
