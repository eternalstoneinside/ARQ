import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { LogOut, ShieldCheck, UserMinus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useSpaces, type Space } from '../context/space-context'
import { getSupabase } from '../lib/supabase'
import type { SpaceMember } from '../lib/spaceMembers'
import {
  buttonVariants,
  modalBackdropVariants,
  modalVariants,
  reducedButtonVariants,
  reducedModalVariants,
} from '../motion/motionTokens'

type SheetMode = 'member' | 'leave'
type SheetView = SheetMode | 'transfer' | 'remove'

interface MemberManagementResult {
  kind: 'leave' | 'remove' | 'transfer'
  message: string
  remainingSpaces?: Space[]
}

interface MemberManagementSheetProps {
  member: SpaceMember | null
  mode: SheetMode
  onClose: () => void
  onCompleted: (result: MemberManagementResult) => void
  open: boolean
}

export function MemberManagementSheet({ member, mode, onClose, onCompleted, open }: MemberManagementSheetProps) {
  const { activeSpace, refreshSpaces } = useSpaces()
  const reduceMotion = useReducedMotion()
  const [view, setView] = useState<SheetView>(mode)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const buttonMotion = reduceMotion ? reducedButtonVariants : buttonVariants

  useEffect(() => {
    if (!open) return
    setView(mode)
    setError(null)
    setSubmitting(false)
  }, [mode, open, member])

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
    setView(nextView)
  }

  const runAction = async () => {
    if (!activeSpace || submitting) return
    if (view !== 'leave' && !member) return
    setSubmitting(true)
    setError(null)

    try {
      if (view === 'transfer' && member) {
        const { error: actionError } = await getSupabase().rpc('transfer_space_ownership', {
          p_new_owner_id: member.userId,
          p_space_id: activeSpace.id,
        })
        if (actionError) throw actionError
        await refreshSpaces()
        onCompleted({ kind: 'transfer', message: `${member.displayName} тепер керує простором.` })
      } else if (view === 'remove' && member) {
        const { error: actionError } = await getSupabase().rpc('remove_space_member', {
          p_member_id: member.userId,
          p_space_id: activeSpace.id,
        })
        if (actionError) throw actionError
        await refreshSpaces()
        onCompleted({ kind: 'remove', message: `${member.displayName} більше не має доступу.` })
      } else if (view === 'leave') {
        const { error: actionError } = await getSupabase().rpc('leave_space', { p_space_id: activeSpace.id })
        if (actionError) throw actionError
        const remainingSpaces = await refreshSpaces()
        onCompleted({ kind: 'leave', message: `Ви вийшли з простору «${activeSpace.name}».`, remainingSpaces })
      }
      onClose()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Не вдалося виконати дію.')
      setSubmitting(false)
    }
  }

  const renderContent = () => {
    if (view === 'member' && member) {
      return (
        <motion.div className="space-sheet__panel" key="member" variants={reduceMotion ? reducedModalVariants : modalVariants} initial="hidden" animate="visible" exit="exit">
          <div className="space-sheet__heading">
            <span>Учасник простору</span>
            <h2 id="member-sheet-title">{member.displayName}</h2>
            <p>Керуйте роллю та доступом без зміни історії простору.</p>
          </div>
          <div className="space-sheet__actions">
            <button className="space-sheet__action interactive" type="button" onClick={() => openView('transfer')}>
              <ShieldCheck size={18} strokeWidth={1.55} />
              <span><strong>Передати право власника</strong><small>Ви залишитеся звичайним учасником</small></span>
            </button>
            <button className="space-sheet__action space-sheet__action--danger interactive" type="button" onClick={() => openView('remove')}>
              <UserMinus size={18} strokeWidth={1.55} />
              <span><strong>Видалити з простору</strong><small>Учасник одразу втратить доступ</small></span>
            </button>
          </div>
          <button className="space-sheet__dismiss interactive" type="button" onClick={onClose}>Закрити</button>
        </motion.div>
      )
    }

    const isTransfer = view === 'transfer'
    const isLeave = view === 'leave'
    const title = isLeave
      ? `Вийти з «${activeSpace?.name ?? 'простору'}»?`
      : isTransfer
        ? `Передати простір ${member?.displayName ?? 'учаснику'}?`
        : `Видалити ${member?.displayName ?? 'учасника'}?`
    const description = isLeave
      ? 'Ви втратите доступ до спільного балансу. Повернутися можна буде лише за новим запрошенням.'
      : isTransfer
        ? 'Новий власник зможе керувати учасниками, запрошеннями та видалити простір. Ви залишитеся учасником.'
        : 'Доступ буде закрито одразу. Усі попередні записи залишаться в історії простору.'

    return (
      <motion.div className="space-sheet__panel" key={view} variants={reduceMotion ? reducedModalVariants : modalVariants} initial="hidden" animate="visible" exit="exit">
        <div className="space-sheet__heading">
          <span>{isTransfer ? 'Зміна власника' : 'Підтвердження'}</span>
          <h2 id="member-sheet-title">{title}</h2>
          <p>{description}</p>
        </div>
        {error && <p className="space-sheet__error" role="alert">{error}</p>}
        <div className="space-sheet__footer space-sheet__footer--split">
          <button className="space-sheet__secondary interactive" type="button" disabled={submitting} onClick={isLeave ? onClose : () => openView('member')}>Назад</button>
          <motion.button
            className={`space-sheet__submit interactive ${isTransfer ? '' : 'space-sheet__submit--danger'}`}
            type="button"
            disabled={submitting}
            variants={buttonMotion}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onClick={() => void runAction()}
          >
            {isTransfer ? <ShieldCheck size={16} strokeWidth={1.7} /> : isLeave ? <LogOut size={16} strokeWidth={1.7} /> : <UserMinus size={16} strokeWidth={1.7} />}
            {submitting ? 'Застосовуємо…' : isTransfer ? 'Передати' : isLeave ? 'Вийти' : 'Видалити'}
          </motion.button>
        </div>
      </motion.div>
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
            aria-labelledby="member-sheet-title"
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
