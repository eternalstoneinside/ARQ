import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, MoreHorizontal, Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { SpaceManagementSheet } from '../components/SpaceManagementSheet'
import { useSpaces, type Space } from '../context/space-context'
import {
  cardVariants,
  listVariants,
  pageVariants,
  reducedCardVariants,
  reducedPageVariants,
} from '../motion/motionTokens'

type SheetState = { mode: 'create'; space: null } | { mode: 'manage'; space: Space }

export function SpacesPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const { activeSpace, spaces } = useSpaces()
  const [sheet, setSheet] = useState<SheetState | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const noticeTimer = useRef<number | null>(null)
  const pageMotion = reduceMotion ? reducedPageVariants : pageVariants
  const rowMotion = reduceMotion ? reducedCardVariants : cardVariants
  const ownedCount = spaces.filter((space) => space.role === 'owner').length
  const handleBack = () => {
    if (location.state?.fromSettings) {
      navigate(-1)
      return
    }
    navigate('/app/settings', { replace: true })
  }

  useEffect(() => () => {
    if (noticeTimer.current !== null) window.clearTimeout(noticeTimer.current)
  }, [])

  const announce = (message: string) => {
    if (noticeTimer.current !== null) window.clearTimeout(noticeTimer.current)
    setNotice(message)
    noticeTimer.current = window.setTimeout(() => setNotice(null), 3600)
  }

  return (
    <motion.article className="subpage spaces-page" variants={pageMotion} initial="hidden" animate="visible">
      <header className="simple-header simple-header--centered">
        <button className="icon-button interactive" type="button" onClick={handleBack} aria-label="Назад"><ArrowLeft size={18} /></button>
        <h1>Простори</h1>
        <button className="icon-button spaces-page__create interactive" type="button" onClick={() => setSheet({ mode: 'create', space: null })} aria-label="Створити простір"><Plus size={18} /></button>
      </header>

      <motion.section className="spaces-page__intro" variants={rowMotion}>
        <span>Керування</span>
        <h2>Ваші простори.</h2>
        <p>Створюйте окремий простір для дому, подорожі або спільного проєкту.</p>
      </motion.section>

      <motion.section className="spaces-page__collection" variants={rowMotion} aria-labelledby="spaces-list-title">
        <header>
          <div>
            <h2 id="spaces-list-title">Усі простори</h2>
            <span>{spaces.length}</span>
          </div>
          <small>Ви керуєте: {ownedCount}</small>
        </header>

        <motion.div className="spaces-list" role="list" variants={listVariants} initial="hidden" animate="visible">
          {spaces.map((space, index) => (
            <motion.div className={`spaces-list__row ${space.id === activeSpace?.id ? 'is-active' : ''}`} role="listitem" key={space.id} variants={rowMotion}>
              <span className="spaces-list__index">{String(index + 1).padStart(2, '0')}</span>
              <span className="spaces-list__copy">
                <strong>{space.name}</strong>
                <small>
                  {space.role === 'owner' ? 'Власник' : 'Учасник'}
                  {space.id === activeSpace?.id && <em>Активний</em>}
                </small>
              </span>
              {space.role === 'owner' ? (
                <button className="spaces-list__menu interactive" type="button" onClick={() => setSheet({ mode: 'manage', space })} aria-label={`Керувати простором ${space.name}`}>
                  <MoreHorizontal size={19} strokeWidth={1.55} />
                </button>
              ) : <span className="spaces-list__readonly">Лише перегляд</span>}
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <motion.button className="spaces-page__new interactive" type="button" variants={rowMotion} onClick={() => setSheet({ mode: 'create', space: null })}>
        <Plus size={17} strokeWidth={1.6} />
        <span><strong>Створити простір</strong><small>Почати новий спільний баланс</small></span>
      </motion.button>

      <div className={`spaces-page__notice ${notice ? 'is-visible' : ''}`} role="status" aria-live="polite">{notice ?? ''}</div>

      <SpaceManagementSheet
        open={Boolean(sheet)}
        mode={sheet?.mode ?? 'create'}
        space={sheet?.space ?? null}
        onClose={() => setSheet(null)}
        onCreated={(space) => announce(`Простір «${space.name}» створено.`)}
        onRenamed={(space) => announce(`Назву змінено на «${space.name}».`)}
        onDeleted={(space, remainingSpaces) => {
          if (remainingSpaces.length === 0) {
            navigate('/onboarding', { replace: true })
            return
          }
          announce(`Простір «${space.name}» видалено.`)
        }}
      />
    </motion.article>
  )
}
