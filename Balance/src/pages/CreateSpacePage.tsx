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

const examples = ['Дім Дмитра', 'Дім Олени та Андрія', 'Подорож до Японії']

export function CreateSpacePage() {
  const [spaceName, setSpaceName] = useState('')
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const normalizedName = spaceName.trim()
  const pageMotion = reduceMotion ? reducedPageVariants : pageVariants
  const cardMotion = reduceMotion ? reducedCardVariants : cardVariants
  const buttonMotion = reduceMotion ? reducedButtonVariants : buttonVariants

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (normalizedName) navigate('/onboarding/invite')
  }

  return (
    <motion.main className="entry-screen onboarding-flow-screen onboarding-flow-screen--create" variants={pageMotion} initial="hidden" animate="visible">
      <motion.form className="onboarding-flow-content" onSubmit={handleSubmit} variants={listVariants}>
        <MotionWordmark wordmarkClassName="onboarding-flow-wordmark" />

        <motion.div
          className="onboarding-unfolding-surface"
          layoutId="create-space-surface"
          layout
          transition={sharedTransition}
          variants={cardMotion}
        >
          <div className="onboarding-flow-intro">
            <h1>Назвіть<br />ваш простір.</h1>
            <p>Це може бути дім, подорож,<br />проєкт або щось особливе для вас.</p>
          </div>

          <div className="space-name-field">
            <label htmlFor="space-name">Назва простору</label>
            <input
              id="space-name"
              name="space-name"
              type="text"
              value={spaceName}
              onChange={(event) => setSpaceName(event.target.value)}
              placeholder="Введіть назву"
              autoComplete="off"
              enterKeyHint="next"
            />
          </div>

          <div className="space-examples" aria-label="Приклади назв">
            <span>Приклади</span>
            <motion.div variants={listVariants}>
              {examples.map((example) => (
                <motion.button
                  className="interactive"
                  type="button"
                  key={example}
                  variants={cardMotion}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setSpaceName(example)}
                >
                  {example}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </motion.div>

        <motion.div className="onboarding-flow-footer" variants={cardMotion}>
          <motion.button
            className="onboarding-continue interactive"
            type="submit"
            disabled={!normalizedName}
            variants={buttonMotion}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
          >
            <span>Продовжити</span>
          </motion.button>
        </motion.div>
      </motion.form>
    </motion.main>
  )
}
