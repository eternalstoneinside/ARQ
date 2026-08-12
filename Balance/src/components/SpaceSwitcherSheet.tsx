import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router'
import { useSpaces } from '../context/space-context'
import {
  modalBackdropVariants,
  modalVariants,
  reducedModalVariants,
} from '../motion/motionTokens'

export function SpaceSwitcherSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const { activeSpace, setActiveSpace, spaces } = useSpaces()
  const [switchingId, setSwitchingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const firstOptionRef = useRef<HTMLButtonElement | null>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setSwitchingId(null)
    setError(null)
    const focusFrame = window.requestAnimationFrame(() => firstOptionRef.current?.focus())
    return () => {
      window.cancelAnimationFrame(focusFrame)
      previousFocusRef.current?.focus()
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !switchingId) onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose, open, switchingId])

  const handleSelect = async (spaceId: string) => {
    if (switchingId) return
    if (spaceId === activeSpace?.id) {
      onClose()
      return
    }

    setSwitchingId(spaceId)
    setError(null)
    try {
      await setActiveSpace(spaceId)
      onClose()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Не вдалося змінити простір.')
      setSwitchingId(null)
    }
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="sheet-backdrop"
          role="presentation"
          variants={reduceMotion ? reducedModalVariants : modalBackdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !switchingId) onClose()
          }}
        >
          <motion.section
            className="space-switch-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="space-switch-title"
            variants={reduceMotion ? reducedModalVariants : modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <span className="sheet-handle" aria-hidden="true" />
            <div className="space-switch-sheet__heading">
              <h2 id="space-switch-title">Ваші простори</h2>
              <p>Оберіть простір, з яким хочете працювати.</p>
            </div>

            <div className="space-switch-list" role="listbox" aria-label="Доступні простори">
              {spaces.map((space, index) => {
                const selected = space.id === activeSpace?.id
                const switching = space.id === switchingId
                return (
                  <button
                    className={`space-switch-list__item interactive ${selected ? 'is-active' : ''}`}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    disabled={Boolean(switchingId)}
                    key={space.id}
                    ref={index === 0 ? firstOptionRef : undefined}
                    onClick={() => void handleSelect(space.id)}
                  >
                    <span className="space-switch-list__copy">
                      <strong>{space.name}</strong>
                      <small>{switching ? 'Змінюємо…' : selected ? 'Активний' : space.role === 'owner' ? 'Власник' : 'Учасник'}</small>
                    </span>
                    <span className="space-switch-list__status" aria-hidden="true">{selected && <Check size={17} strokeWidth={1.7} />}</span>
                  </button>
                )
              })}
            </div>

            {error && <p className="space-switch-sheet__error" role="alert">{error}</p>}

            <button
              className="space-switch-sheet__manage interactive"
              type="button"
              onClick={() => {
                onClose()
                navigate('/app/settings/spaces')
              }}
            >
              Керувати просторами
            </button>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>,
    document.getElementById('sheet-root')!,
  )
}
