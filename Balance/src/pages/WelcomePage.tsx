import { motion, useReducedMotion } from 'framer-motion'
import { useNavigate } from 'react-router'
import { LegalNotice } from '../components/legal/LegalNotice'
import { MotionWordmark } from '../components/motion/MotionWordmark'
import {
  buttonVariants,
  cardVariants,
  listVariants,
  pageVariants,
  reducedButtonVariants,
  reducedCardVariants,
  reducedPageVariants,
} from '../motion/motionTokens'

function GoogleMark() {
  return (
    <svg className="google-mark" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h6a5.1 5.1 0 0 1-2.2 3.3v2.7h3.6c2.1-2 3.2-4.8 3.2-7.9Z" />
      <path fill="#34A853" d="M12 23c3 0 5.5-1 7.4-2.9l-3.6-2.7c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.7H2v2.8A11.2 11.2 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.7 13.8A6.7 6.7 0 0 1 5.3 12c0-.6.1-1.2.4-1.8V7.4H2A11 11 0 0 0 .8 12c0 1.7.4 3.2 1.2 4.6l3.7-2.8Z" />
      <path fill="#EA4335" d="M12 5.5c1.6 0 3.1.6 4.3 1.7l3.2-3.2A10.8 10.8 0 0 0 12 1 11.2 11.2 0 0 0 2 7.4l3.7 2.8c.9-2.7 3.4-4.7 6.3-4.7Z" />
    </svg>
  )
}

export function WelcomePage() {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const pageMotion = reduceMotion ? reducedPageVariants : pageVariants
  const cardMotion = reduceMotion ? reducedCardVariants : cardVariants
  const buttonMotion = reduceMotion ? reducedButtonVariants : buttonVariants

  return (
    <motion.main className="entry-screen welcome-screen" variants={pageMotion} initial="hidden" animate="visible">
      <motion.section className="welcome-copy" variants={listVariants}>
        <MotionWordmark wordmarkClassName="welcome-wordmark" />
        <motion.div className="welcome-intro" variants={cardMotion}>
          <h1>
            <span>Спільні фінанси.</span>
            <strong>Без хаосу.</strong>
          </h1>
          <p>Спокійно ведіть спільний баланс, бачте внески й зберігайте розуміння.</p>
        </motion.div>
      </motion.section>

      <motion.section className="welcome-actions" aria-label="Авторизація" variants={listVariants}>
        <motion.button
          className="google-button interactive"
          type="button"
          variants={buttonMotion}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          onClick={() => navigate('/onboarding')}
        >
          <GoogleMark />
          <span>Увійти з Google</span>
        </motion.button>

        <motion.div className="auth-separator" aria-hidden="true" variants={cardMotion}>
          <span />
          <em>або</em>
          <span />
        </motion.div>

        <motion.button
          className="other-signin interactive"
          type="button"
          variants={buttonMotion}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
        >
          Інші способи входу
        </motion.button>

        <motion.div className="welcome-legal-motion" variants={cardMotion}>
          <LegalNotice className="welcome-legal" />
        </motion.div>
      </motion.section>
    </motion.main>
  )
}
