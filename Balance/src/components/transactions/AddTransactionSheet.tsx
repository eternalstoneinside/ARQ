import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarDays, ChevronRight, CircleUserRound, LoaderCircle, Shapes, Text } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useTransactions } from '../../context/transactions-context'
import { useAuth } from '../../context/auth-context'
import { useSpaces } from '../../context/space-context'
import { useCategories } from '../../context/categories-context'
import type { Transaction, TransactionType } from '../../domain/types'
import { parseAmountToMinor } from '../../lib/format'
import { fetchSpaceMembers, type SpaceMember } from '../../lib/spaceMembers'
import { modalBackdropVariants, modalVariants, reducedModalVariants } from '../../motion/motionTokens'

const formSchema = z.object({
  type: z.enum(['expense', 'income']),
  amount: z.string().refine((value) => {
    const minor = parseAmountToMinor(value)
    return minor !== null && minor > 0
  }, 'Введіть суму, більшу за нуль'),
  categoryId: z.string().min(1, 'Оберіть категорію'),
  personId: z.string().min(1, 'Оберіть учасника'),
  date: z.string().min(1, 'Оберіть дату'),
  comment: z.string().max(160, 'До 160 символів'),
})

type FormValues = z.infer<typeof formSchema>

interface AddTransactionSheetProps {
  onClose: () => void
  open: boolean
  transaction?: Transaction | null
}

function amountForInput(amountMinor: number) {
  return (amountMinor / 100).toFixed(2).replace('.', ',')
}

export function AddTransactionSheet({ open, onClose, transaction = null }: AddTransactionSheetProps) {
  const { addTransaction, updateTransaction } = useTransactions()
  const { categories } = useCategories()
  const { user } = useAuth()
  const { activeSpace } = useSpaces()
  const reduceMotion = useReducedMotion()
  const [members, setMembers] = useState<SpaceMember[]>([])
  const [membersLoading, setMembersLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'expense',
      amount: '',
      categoryId: 'food',
      personId: '',
      date: new Date().toISOString().slice(0, 10),
      comment: '',
    },
  })
  const type = watch('type')
  const defaultCategoryId = useCallback((nextType: TransactionType) => {
    const preferredId = nextType === 'expense' ? 'food' : 'salary'
    return categories.find((category) => category.type === nextType && !category.archivedAt && category.id === preferredId)?.id
      ?? categories.find((category) => category.type === nextType && !category.archivedAt)?.id
      ?? ''
  }, [categories])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [isSubmitting, open, onClose])

  useEffect(() => {
    if (!open || !activeSpace) return
    let cancelled = false
    setMembersLoading(true)
    setSubmitError(null)
    void fetchSpaceMembers(activeSpace.id)
      .then((nextMembers) => {
        if (cancelled) return
        const visibleMembers = transaction && !nextMembers.some((member) => member.userId === transaction.personId)
          ? [...nextMembers, {
              avatarUrl: null,
              displayName: transaction.personName,
              joinedAt: transaction.createdAt,
              role: 'member' as const,
              userId: transaction.personId,
            }]
          : nextMembers
        setMembers(visibleMembers)
        const preferred = visibleMembers.find((member) => member.userId === user?.id) ?? visibleMembers[0]
        reset({
          type: transaction?.type ?? 'expense',
          amount: transaction ? amountForInput(transaction.amountMinor) : '',
          categoryId: transaction?.categoryId ?? defaultCategoryId('expense'),
          personId: transaction?.personId ?? preferred?.userId ?? '',
          date: transaction?.transactionDate ?? new Date().toISOString().slice(0, 10),
          comment: transaction?.comment ?? '',
        })
      })
      .catch((reason) => {
        if (!cancelled) setSubmitError(reason instanceof Error ? reason.message : 'Не вдалося завантажити учасників.')
      })
      .finally(() => {
        if (!cancelled) setMembersLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [activeSpace, defaultCategoryId, open, reset, transaction, user])

  const onSubmit = async (values: FormValues) => {
    const amountMinor = parseAmountToMinor(values.amount)
    if (amountMinor === null) return
    setSubmitError(null)
    try {
      const input = {
        type: values.type,
        amountMinor,
        categoryId: values.categoryId,
        personId: values.personId,
        transactionDate: values.date,
        comment: values.comment.trim() || null,
      }
      if (transaction) await updateTransaction(transaction.id, input)
      else await addTransaction(input)
      reset({
        type: 'expense',
        amount: '',
        categoryId: defaultCategoryId('expense'),
        personId: user?.id ?? members[0]?.userId ?? '',
        date: new Date().toISOString().slice(0, 10),
        comment: '',
      })
      onClose()
    } catch (reason) {
      setSubmitError(reason instanceof Error ? reason.message : 'Не вдалося додати операцію.')
    }
  }

  const visibleCategories = categories.filter((category) => category.type === type && (
    !category.archivedAt || (transaction?.categoryId === category.id && transaction.type === type)
  ))

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
            if (event.target === event.currentTarget && !isSubmitting) onClose()
          }}
        >
          <motion.section
            className="transaction-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sheet-title"
            variants={reduceMotion ? reducedModalVariants : modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <span className="sheet-handle" aria-hidden="true" />
            <h2 id="sheet-title">{transaction ? 'Редагувати операцію' : 'Нова операція'}</h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="sheet-type-toggle" aria-label="Тип операції">
                {(['expense', 'income'] as TransactionType[]).map((value) => (
                  <button
                    className={type === value ? 'is-active' : ''}
                    key={value}
                    type="button"
                    onClick={() => {
                      setValue('type', value)
                      setValue('categoryId', defaultCategoryId(value))
                    }}
                  >
                    {value === 'expense' ? 'Витрата' : 'Дохід'}
                  </button>
                ))}
              </div>

              <label className="sheet-amount">
                <span>Сума</span>
                <span className="amount-control">
                  <input inputMode="decimal" placeholder="0,00" autoFocus {...register('amount')} />
                  <small>PLN</small>
                </span>
                {errors.amount && <em>{errors.amount.message}</em>}
              </label>

              <div className="sheet-fields">
                <label>
                  <Shapes size={16} />
                  <strong>Категорія</strong>
                  <select {...register('categoryId')}>
                    {visibleCategories.map((category) => <option key={category.id} value={category.id}>{category.name}{category.archivedAt ? ' (архів)' : ''}</option>)}
                  </select>
                  <ChevronRight size={14} />
                </label>
                <label>
                  <Text size={16} />
                  <strong>Опис</strong>
                  <input placeholder="Необов’язково" {...register('comment')} />
                  <ChevronRight size={14} />
                </label>
                <label>
                  <CalendarDays size={16} />
                  <strong>Дата</strong>
                  <input type="date" {...register('date')} />
                  <ChevronRight size={14} />
                </label>
                <label>
                  <CircleUserRound size={16} />
                  <strong>Учасник</strong>
                  <select {...register('personId')}>
                    {members.map((member) => <option key={member.userId} value={member.userId}>{member.displayName}</option>)}
                  </select>
                  <ChevronRight size={14} />
                </label>
              </div>

              {errors.personId && <p className="sheet-error" role="alert">{errors.personId.message}</p>}
              {submitError && <p className="sheet-error" role="alert">{submitError}</p>}
              <button className="sheet-submit interactive" disabled={isSubmitting || membersLoading || members.length === 0} type="submit">
                {(isSubmitting || membersLoading) && <LoaderCircle className="sheet-spinner" size={16} aria-hidden="true" />}
                {isSubmitting
                  ? transaction ? 'Зберігаємо…' : 'Додаємо…'
                  : membersLoading ? 'Завантажуємо…' : transaction ? 'Зберегти зміни' : 'Додати операцію'}
              </button>
            </form>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>,
    document.getElementById('sheet-root')!,
  )
}
