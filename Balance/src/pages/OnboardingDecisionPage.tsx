import { Layers3, UsersRound } from 'lucide-react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { useNavigate } from 'react-router'
import { LegalNotice } from '../components/legal/LegalNotice'
import { MotionWordmark } from '../components/motion/MotionWordmark'
import {
  cardVariants,
  listVariants,
  pageVariants,
  reducedCardVariants,
  reducedPageVariants,
  sharedTransition,
} from '../motion/motionTokens'

type DecisionCardProps = {
  description: string
  icon: typeof Layers3
  primary?: boolean
  title: string
  onSelect: () => void
  layoutId: string
  motionVariants: Variants
}

function DecisionCard({ description, icon: Icon, primary = false, title, onSelect, layoutId, motionVariants }: DecisionCardProps) {
  return (
    <motion.button
      className={`decision-card interactive ${primary ? 'decision-card--primary' : ''}`}
      type="button"
      onClick={onSelect}
      layoutId={layoutId}
      layout
      transition={sharedTransition}
      variants={motionVariants}
      whileHover="hover"
      whileTap="tap"
    >
      <Icon className="decision-card__icon" size={34} strokeWidth={1.35} aria-hidden="true" />
      <span className="decision-card__copy">
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
    </motion.button>
  )
}

export function OnboardingDecisionPage() {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const pageMotion = reduceMotion ? reducedPageVariants : pageVariants
  const cardMotion = reduceMotion ? reducedCardVariants : cardVariants

  return (
    <motion.main className="entry-screen decision-screen" variants={pageMotion} initial="hidden" animate="visible">
      <motion.section className="decision-content" variants={listVariants}>
        <MotionWordmark wordmarkClassName="decision-wordmark" />

        <motion.div className="decision-intro" variants={cardMotion}>
          <h1>Вітаємо,<br />Дмитро.</h1>
          <p>Оберіть, як ви хочете почати<br />користуватися ARQ Balance.</p>
        </motion.div>

        <motion.div className="decision-list" aria-label="Оберіть спосіб початку роботи" variants={listVariants}>
          <DecisionCard
            primary
            icon={Layers3}
            title="Створити простір"
            description="Почніть власний простір для спільних фінансів."
            onSelect={() => navigate('/onboarding/create')}
            layoutId="create-space-surface"
            motionVariants={cardMotion}
          />
          <DecisionCard
            icon={UsersRound}
            title="У мене є запрошення"
            description="Приєднайтеся до наявного простору."
            onSelect={() => navigate('/onboarding/join')}
            layoutId="join-space-surface"
            motionVariants={cardMotion}
          />
        </motion.div>

        <motion.div className="decision-legal-motion" variants={cardMotion}>
          <LegalNotice className="decision-legal" />
        </motion.div>
      </motion.section>
    </motion.main>
  )
}
