import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Check, PencilLine, Trash2 } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { useSpaces, type Space } from '../context/space-context'
import {
  buttonVariants,
  modalBackdropVariants,
  modalVariants,
  reducedButtonVariants,
  reducedModalVariants,
} from '../motion/motionTokens'

type InitialMode = 'create' | 'manage'
type SheetView = InitialMode | 'rename' | 'delete'

interface SpaceManagementSheetProps {
  mode: InitialMode
  onClose: () => void
  onCreated: (space: Space) => void
  onDeleted: (space: Space, remainingSpaces: Space[]) => void
  onRenamed: (space: Space) => void
  open: boolean
  space: Space | null
}

export function SpaceManagementSheet({
  mode,
  onClose,
  onCreated,
  onDeleted,
  onRenamed,
  open,
  space,
}: SpaceManagementSheetProps) {
  const { createSpace, deleteSpace, renameSpace } = useSpaces()
  const reduceMotion = useReducedMotion()
  const [view, setView] = useState<SheetView>(mode)
  const [name, setName] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const buttonMotion = reduceMotion ? reducedButtonVariants : buttonVariants
  const normalizedName = name.trim()
  const canSaveName = normalizedName.length > 0 && normalizedName.length <= 80
  const canDelete = Boolean(space && confirmation.trim() === space.name)

  useEffect(() => {
    if (!open) return
    setView(mode)
    setName(mode === 'manage' ? space?.name ?? '' : '')
    setConfirmation('')
    setError(null)
    setSubmitting(false)
  }, [mode, open, space])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !submitting) onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose, open, submitting])

  const openView = (nextView: SheetView) => {
    setError(null)
    setName(space?.name ?? '')
    setConfirmation('')
    setView(nextView)
  }

  const handleNameSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSaveName || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      if (view === 'create') {
        const created = await createSpace(normalizedName)
        onCreated(created)
      } else if (view === 'rename' && space) {
        const renamed = await renameSpace(space.id, normalizedName)
        onRenamed(renamed)
      }
      onClose()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Не вдалося зберегти зміни.')
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!space || !canDelete || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const remainingSpaces = await deleteSpace(space.id)
      onDeleted(space, remainingSpaces)
      onClose()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Не вдалося видалити простір.')
      setSubmitting(false)
    }
  }

  const renderContent = () => {
    if (view === 'manage' && space) {
      return (
        <motion.div className="space-sheet__panel" key="manage" variants={reduceMotion ? reducedModalVariants : modalVariants} initial="hidden" animate="visible" exit="exit">
          <div className="space-sheet__heading">
            <span>Керування простором</span>
            <h2 id="space-sheet-title">{space.name}</h2>
            <p>Оберіть одну дію. Зміни застосуються для всіх учасників.</p>
          </div>
          <div className="space-sheet__actions">
            <button className="space-sheet__action interactive" type="button" onClick={() => openView('rename')}>
              <PencilLine size={18} strokeWidth={1.55} />
              <span><strong>Змінити назву</strong><small>Оновити назву для всіх учасників</small></span>
            </button>
            <button className="space-sheet__action space-sheet__action--danger interactive" type="button" onClick={() => openView('delete')}>
              <Trash2 size={18} strokeWidth={1.55} />
              <span><strong>Видалити простір</strong><small>Назавжди припинити доступ до простору</small></span>
            </button>
          </div>
          <button className="space-sheet__dismiss interactive" type="button" onClick={onClose}>Закрити</button>
        </motion.div>
      )
    }

    if (view === 'delete' && space) {
      return (
        <motion.div className="space-sheet__panel" key="delete" variants={reduceMotion ? reducedModalVariants : modalVariants} initial="hidden" animate="visible" exit="exit">
          <div className="space-sheet__heading">
            <span>Незворотна дія</span>
            <h2 id="space-sheet-title">Видалити «{space.name}»?</h2>
            <p>Буде видалено простір, усі запрошення та доступ учасників. Цю дію неможливо скасувати.</p>
          </div>
          <label className="space-sheet__field">
            <span>Введіть назву простору для підтвердження</span>
            <input
              autoFocus
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              placeholder={space.name}
              autoComplete="off"
            />
          </label>
          {error && <p className="space-sheet__error" role="alert">{error}</p>}
          <div className="space-sheet__footer space-sheet__footer--split">
            <button className="space-sheet__secondary interactive" type="button" disabled={submitting} onClick={() => openView('manage')}>Назад</button>
            <motion.button
              className="space-sheet__submit space-sheet__submit--danger interactive"
              type="button"
              disabled={!canDelete || submitting}
              variants={buttonMotion}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onClick={() => void handleDelete()}
            >
              {submitting ? 'Видаляємо…' : 'Видалити назавжди'}
            </motion.button>
          </div>
        </motion.div>
      )
    }

    const isCreate = view === 'create'
    return (
      <motion.form className="space-sheet__panel" key={view} variants={reduceMotion ? reducedModalVariants : modalVariants} initial="hidden" animate="visible" exit="exit" onSubmit={handleNameSubmit}>
        <div className="space-sheet__heading">
          <span>{isCreate ? 'Новий простір' : 'Назва простору'}</span>
          <h2 id="space-sheet-title">{isCreate ? 'Створити простір' : 'Змінити назву'}</h2>
          <p>{isCreate ? 'Окреме місце для спільних фінансів, учасників і домовленостей.' : 'Нова назва одразу з’явиться в усіх учасників.'}</p>
        </div>
        <label className="space-sheet__field">
          <span>Назва</span>
          <input
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Наприклад, Наш дім"
            maxLength={80}
            autoComplete="off"
          />
          <small>{normalizedName.length}/80</small>
        </label>
        {error && <p className="space-sheet__error" role="alert">{error}</p>}
        <div className="space-sheet__footer space-sheet__footer--split">
          <button className="space-sheet__secondary interactive" type="button" disabled={submitting} onClick={view === 'rename' ? () => openView('manage') : onClose}>{view === 'rename' ? 'Назад' : 'Скасувати'}</button>
          <motion.button
            className="space-sheet__submit interactive"
            type="submit"
            disabled={!canSaveName || submitting}
            variants={buttonMotion}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
          >
            <Check size={16} strokeWidth={1.7} />
            {submitting ? 'Зберігаємо…' : isCreate ? 'Створити' : 'Зберегти'}
          </motion.button>
        </div>
      </motion.form>
    )
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
            if (event.target === event.currentTarget && !submitting) onClose()
          }}
        >
          <motion.section
            className="space-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="space-sheet-title"
            variants={reduceMotion ? reducedModalVariants : modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <span className="sheet-handle" aria-hidden="true" />
            <AnimatePresence mode="wait" initial={false}>{renderContent()}</AnimatePresence>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>,
    document.getElementById('sheet-root')!,
  )
}
