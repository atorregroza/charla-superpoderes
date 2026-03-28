import { motion, useReducedMotion } from 'framer-motion'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'

export const SlideInView = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 30,
  threshold = 0.2,
  className = '',
  ...props
}) => {
  const [ref, inView] = useIntersectionObserver({ threshold, triggerOnce: true })
  const shouldReduceMotion = useReducedMotion()

  const directions = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
  }

  if (shouldReduceMotion) {
    return (
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      {...props}
      ref={ref}
      initial={{ opacity: 0, ...directions[direction] }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...directions[direction] }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
