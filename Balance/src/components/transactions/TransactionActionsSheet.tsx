import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { PencilLine, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTransactions } from '../../context/transactions-context'
import type { Transaction } from '../../domain/types'
import {
  buttonVariants,
  modalBackdropVariants,
  modalVariants,
  reducedButtonVariants,
  reducedModalVariants,
} from '../../motion/motionTokens'

interface TransactionActionsSheetProps {
  onClose: () => void
  onDeleted: () => void
  onEdit: () => void
  open: boolean
  transaction: Transaction
}

export function TransactionActionsSheet({ onClose, onDeleted, onEdit, open, transaction }: TransactionActionsSheetProps) {
  const { deleteTransaction } = useTransactions()
  const reduceMotion = useReducedMotion()
  const [view, setView] = useState<'actions' | 'delete'>('actions')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const buttonMotion = reduceMotion ? reducedButtonVariants : buttonVariants

  useEffect(() => {
    if (!open) return
    setView('actions')
    setError(null)
    setSubmitting(false)
  }, [open, transaction.id])

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

  const handleDelete = async () => {
    if (submitting) return
    setSubmitting(true)
    setError(null)
    try {
      await deleteTransaction(transaction.id)
      onDeleted()
      onClose()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Не вдалося видалити операцію.')
      setSubmitting(false)
    }
  }

  const content = view === 'actions' ? (
    <motion.div className="space-sheet__panel" key="actions" variants={reduceMotion ? reducedModalVariants : modalVariants} initial="hidden" animate="visible" exit="exit">
      <div className="space-sheet__heading">
        <span>Операція</span>
        <h2 id="transaction-actions-title">Керування</h2>
        <p>Зміни одразу відобразяться у спільному балансі всіх учасників.</p>
      </div>
      <div className="space-sheet__actions">
        <button className="space-sheet__action interactive" type="button" onClick={onEdit}>
          <PencilLine size={18} strokeWidth={1.55} />
          <span><strong>Редагувати</strong><small>Змінити суму, категорію або опис</small></span>
        </button>
        <button className="space-sheet__action space-sheet__action--danger interactive" type="button" onClick={() => setView('delete')}>
          <Trash2 size={18} strokeWidth={1.55} />
          <span><strong>Видалити операцію</strong><small>Прибрати її зі спільного балансу</small></span>
        </button>
      </div>
      <button className="space-sheet__dismiss interactive" type="button" onClick={onClose}>Закрити</button>
    </motion.div>
  ) : (
    <motion.div className="space-sheet__panel" key="delete" variants={reduceMotion ? reducedModalVariants : modalVariants} initial="hidden" animate="visible" exit="exit">
      <div className="space-sheet__heading">
        <span>Підтвердження</span>
        <h2 id="transaction-actions-title">Видалити операцію?</h2>
        <p>Вона зникне зі списку, балансу та аналітики. Цю дію поки що неможливо скасувати.</p>
      </div>
      {error && <p className="space-sheet__error" role="alert">{error}</p>}
      <div className="space-sheet__footer space-sheet__footer--split">
        <button className="space-sheet__secondary interactive" type="button" disabled={submitting} onClick={() => setView('actions')}>Назад</button>
        <motion.button
          className="space-sheet__submit space-sheet__submit--danger interactive"
          type="button"
          disabled={submitting}
          variants={buttonMotion}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          onClick={() => void handleDelete()}
        >
          <Trash2 size={16} strokeWidth={1.7} />
          {submitting ? 'Видаляємо…' : 'Видалити'}
        </motion.button>
      </div>
    </motion.div>
  )

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
            aria-labelledby="transaction-actions-title"
            variants={reduceMotion ? reducedModalVariants : modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <span className="sheet-handle" aria-hidden="true" />
            <AnimatePresence mode="wait" initial={false}>{content}</AnimatePresence>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>,
    document.getElementById('sheet-root')!,
  )
}
