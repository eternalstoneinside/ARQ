import { Plus } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { LegalNotice } from '../components/legal/LegalNotice'
import { MotionWordmark } from '../components/motion/MotionWordmark'
import {
  buttonVariants,
  cardVariants,
  listVariants,
  motionTokens,
  pageVariants,
  reducedButtonVariants,
  reducedCardVariants,
  reducedPageVariants,
  sharedTransition,
} from '../motion/motionTokens'

export function InvitePersonPage() {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const [finishing, setFinishing] = useState(false)
  const pageMotion = reduceMotion ? reducedPageVariants : pageVariants
  const cardMotion = reduceMotion ? reducedCardVariants : cardVariants
  const buttonMotion = reduceMotion ? reducedButtonVariants : buttonVariants

  const finishOnboarding = () => {
    if (finishing) return
    setFinishing(true)
    window.setTimeout(() => navigate('/app'), reduceMotion ? 120 : motionTokens.duration.ready * 1000)
  }

  return (
    <motion.main className="entry-screen onboarding-flow-screen onboarding-flow-screen--invite" variants={pageMotion} initial="hidden" animate="visible">
      <motion.section
        className="onboarding-flow-content"
        variants={listVariants}
        animate={finishing && !reduceMotion ? { opacity: 0.72, scale: 0.995, filter: 'blur(2px)' } : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={motionTokens.spring.screen}
      >
        <MotionWordmark wordmarkClassName="onboarding-flow-wordmark" />

        <motion.div
          className="onboarding-unfolding-surface"
          layoutId="create-space-surface"
          layout
          transition={sharedTransition}
          variants={cardMotion}
        >
          <div className="onboarding-flow-intro">
            <h1>Хто буде<br />разом з вами?</h1>
            <p>Запросіть людину, щоб вести<br />фінанси разом.</p>
          </div>

          <motion.button
            className="invite-person-action interactive"
            type="button"
            disabled={finishing}
            variants={buttonMotion}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onClick={finishOnboarding}
          >
            <Plus size={27} strokeWidth={1.2} aria-hidden="true" />
            <span>Запросити людину</span>
          </motion.button>

          <div className="flow-separator" aria-hidden="true">
            <span />
            <em>або</em>
            <span />
          </div>

          <motion.button
            className="skip-for-now interactive"
            type="button"
            disabled={finishing}
            variants={buttonMotion}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onClick={finishOnboarding}
          >
            Пропустити поки що
          </motion.button>
        </motion.div>

        <motion.div className="flow-legal-motion" variants={cardMotion}>
          <LegalNotice className="flow-legal" />
        </motion.div>
      </motion.section>

      <AnimatePresence>
        {finishing && (
          <motion.div
            className="onboarding-ready"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduceMotion ? { duration: 0.1 } : motionTokens.spring.screen}
            role="status"
            aria-live="polite"
          >
            <span>Ваш простір готовий.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  )
}
