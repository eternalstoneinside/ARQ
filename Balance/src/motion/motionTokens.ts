import type { Transition, Variants } from 'framer-motion'

export const motionTokens = {
  duration: {
    hover: 0.12,
    focus: 0.15,
    press: 0.18,
    card: 0.25,
    ready: 0.3,
    screen: 0.35,
    shared: 0.45,
    splash: 0.7,
  },
  distance: {
    card: 8,
    page: 12,
    sheet: 36,
  },
  scale: {
    press: 0.985,
    quiet: 0.995,
  },
  stagger: {
    card: 0.08,
    list: 0.065,
  },
  spring: {
    hover: { type: 'spring', visualDuration: 0.12, bounce: 0 },
    press: { type: 'spring', visualDuration: 0.18, bounce: 0 },
    card: { type: 'spring', visualDuration: 0.25, bounce: 0 },
    screen: { type: 'spring', visualDuration: 0.35, bounce: 0 },
    shared: { type: 'spring', visualDuration: 0.45, bounce: 0 },
    sheet: { type: 'spring', visualDuration: 0.35, bounce: 0 },
  },
} as const

export const sharedTransition: Transition = motionTokens.spring.shared

export const pageVariants: Variants = {
  hidden: {
    opacity: 0,
    y: motionTokens.distance.page,
    filter: 'blur(4px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      ...motionTokens.spring.screen,
      staggerChildren: motionTokens.stagger.card,
      delayChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    filter: 'blur(2px)',
    transition: motionTokens.spring.screen,
  },
}

export const cardVariants: Variants = {
  hidden: { opacity: 0, y: motionTokens.distance.card },
  visible: { opacity: 1, y: 0, transition: motionTokens.spring.card },
  hover: { y: -1, transition: motionTokens.spring.hover },
  tap: { scale: motionTokens.scale.press, transition: motionTokens.spring.press },
}

export const listVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: motionTokens.stagger.card,
      delayChildren: 0.03,
    },
  },
}

export const buttonVariants: Variants = {
  rest: { scale: 1, y: 0 },
  hover: { y: -1, transition: motionTokens.spring.hover },
  tap: { scale: motionTokens.scale.press, y: 0, transition: motionTokens.spring.press },
}

export const modalVariants: Variants = {
  hidden: { y: motionTokens.distance.sheet, opacity: 0, filter: 'blur(3px)' },
  visible: { y: 0, opacity: 1, filter: 'blur(0px)', transition: motionTokens.spring.sheet },
  exit: { y: motionTokens.distance.sheet, opacity: 0, filter: 'blur(2px)', transition: motionTokens.spring.sheet },
}

export const modalBackdropVariants: Variants = {
  hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
  visible: { opacity: 1, backdropFilter: 'blur(8px)', transition: motionTokens.spring.screen },
  exit: { opacity: 0, backdropFilter: 'blur(0px)', transition: motionTokens.spring.screen },
}

export const reducedPageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.16 } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
}

export const reducedCardVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.14 } },
  hover: {},
  tap: { opacity: 0.82, transition: { duration: 0.08 } },
}

export const reducedButtonVariants: Variants = {
  rest: { opacity: 1 },
  hover: {},
  tap: { opacity: 0.82, transition: { duration: 0.08 } },
}

export const reducedModalVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.14 } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
}

export const productEntryVariants: Variants = {
  hidden: { y: 24 },
  visible: { y: 0, transition: motionTokens.spring.screen },
}

export const reducedProductEntryVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.16 } },
}

export const routeVariants: Variants = {
  hidden: { opacity: 0, y: 5 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', visualDuration: 0.24, bounce: 0 } },
  exit: { opacity: 0, y: -3, transition: { duration: 0.14, ease: 'easeOut' } },
}

export const reducedRouteVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.12 } },
  exit: { opacity: 0, transition: { duration: 0.08 } },
}
