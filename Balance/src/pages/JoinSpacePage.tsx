import { motion, useReducedMotion } from 'framer-motion'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { MotionWordmark } from '../components/motion/MotionWordmark'
import {
  buttonVariants,
  cardVariants,
  listVariants,
  pageVariants,
  reducedButtonVariants,
  reducedCardVariants,
  reducedPageVariants,
  sharedTransition,
} from '../motion/motionTokens'

export function JoinSpacePage() {
  const [inviteCode, setInviteCode] = useState('')
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const normalizedCode = inviteCode.trim()
  const pageMotion = reduceMotion ? reducedPageVariants : pageVariants
  const cardMotion = reduceMotion ? reducedCardVariants : cardVariants
  const buttonMotion = reduceMotion ? reducedButtonVariants : buttonVariants

  const handleCodeChange = (value: string) => {
    setInviteCode(value.toUpperCase().replace(/[^A-ZА-ЯІЇЄҐ0-9-]/g, ''))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (normalizedCode.length >= 4) navigate('/app')
  }

  return (
    <motion.main className="entry-screen onboarding-flow-screen onboarding-flow-screen--join" variants={pageMotion} initial="hidden" animate="visible">
      <motion.form className="onboarding-flow-content" onSubmit={handleSubmit} variants={listVariants}>
        <MotionWordmark wordmarkClassName="onboarding-flow-wordmark" />

        <motion.div
          className="onboarding-unfolding-surface"
          layoutId="join-space-surface"
          layout
          transition={sharedTransition}
          variants={cardMotion}
        >
          <div className="onboarding-flow-intro">
            <h1>Введіть код<br />запрошення.</h1>
            <p>Код надіслав власник простору,<br />до якого вас запросили.</p>
          </div>

          <div className="space-name-field invite-code-field">
            <label htmlFor="invite-code">Код запрошення</label>
            <input
              id="invite-code"
              name="invite-code"
              type="text"
              value={inviteCode}
              onChange={(event) => handleCodeChange(event.target.value)}
              placeholder="ARQ-0000"
              autoComplete="one-time-code"
              autoCapitalize="characters"
              enterKeyHint="done"
              maxLength={12}
              spellCheck={false}
            />
            <small>Введіть код без пробілів.</small>
          </div>
        </motion.div>

        <motion.div className="onboarding-flow-footer" variants={cardMotion}>
          <motion.button
            className="onboarding-continue interactive"
            type="submit"
            disabled={normalizedCode.length < 4}
            variants={buttonMotion}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
          >
            <span>Приєднатися</span>
          </motion.button>
        </motion.div>
      </motion.form>
    </motion.main>
  )
}
