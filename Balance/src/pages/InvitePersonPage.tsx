import { Copy, KeyRound, RefreshCw } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { MotionWordmark } from '../components/motion/MotionWordmark'
import { useSpaces } from '../context/space-context'
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
  const { createInvite, latestInviteCode } = useSpaces()
  const [finishing, setFinishing] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const pageMotion = reduceMotion ? reducedPageVariants : pageVariants
  const cardMotion = reduceMotion ? reducedCardVariants : cardVariants
  const buttonMotion = reduceMotion ? reducedButtonVariants : buttonVariants

  const finishOnboarding = () => {
    if (finishing) return
    setFinishing(true)
    window.setTimeout(() => navigate('/app', { replace: true }), reduceMotion ? 120 : motionTokens.duration.ready * 1000)
  }

  const generateCode = async () => {
    setGenerating(true)
    setError(null)
    try {
      await createInvite()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Не вдалося створити код запрошення.')
    } finally {
      setGenerating(false)
    }
  }

  const copyCode = async () => {
    if (!latestInviteCode) {
      await generateCode()
      return
    }
    await navigator.clipboard.writeText(latestInviteCode)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
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
            <p>Надішліть код людині, з якою<br />хочете вести фінанси разом.</p>
          </div>

          <motion.button
            className="invite-person-action invite-code-action interactive"
            type="button"
            disabled={finishing || generating}
            variants={buttonMotion}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onClick={() => void copyCode()}
          >
            <KeyRound size={25} strokeWidth={1.25} aria-hidden="true" />
            <span className="invite-code-copy">
              <small>Код запрошення</small>
              <strong>{latestInviteCode ?? (generating ? 'Генеруємо…' : 'Згенерувати код')}</strong>
              {copied && <em role="status">Скопійовано</em>}
            </span>
            {latestInviteCode && <Copy size={19} strokeWidth={1.35} aria-hidden="true" />}
          </motion.button>

          {latestInviteCode && (
            <motion.button className="regenerate-invite interactive" type="button" disabled={generating || finishing} variants={buttonMotion} initial="rest" whileTap="tap" onClick={() => void generateCode()}>
              <RefreshCw size={14} aria-hidden="true" />
              {generating ? 'Генеруємо…' : 'Створити новий код'}
            </motion.button>
          )}
          {error && <p className="entry-error" role="alert">{error}</p>}
        </motion.div>

        <motion.div className="onboarding-flow-footer" variants={cardMotion}>
          <motion.button className="onboarding-continue interactive" type="button" disabled={finishing} variants={buttonMotion} initial="rest" whileHover="hover" whileTap="tap" onClick={finishOnboarding}>
            <span>Продовжити</span>
          </motion.button>
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
