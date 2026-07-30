import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarDays, ChevronRight, CircleUserRound, Shapes, Text } from 'lucide-react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useTransactions } from '../../context/transactions-context'
import { categories, people } from '../../data/mock'
import type { Transaction, TransactionType } from '../../domain/types'
import { parseAmountToMinor } from '../../lib/format'

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

export function AddTransactionSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addTransaction } = useTransactions()
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
      personId: 'p1',
      date: new Date().toISOString().slice(0, 10),
      comment: '',
    },
  })
  const type = watch('type')

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const onSubmit = (values: FormValues) => {
    const amountMinor = parseAmountToMinor(values.amount)
    if (amountMinor === null) return
    const now = new Date().toISOString()
    const transaction: Transaction = {
      id: crypto.randomUUID(),
      coupleSpaceId: 'c1',
      type: values.type,
      amountMinor,
      currency: 'PLN',
      categoryId: values.categoryId,
      personId: values.personId,
      transactionDate: values.date,
      comment: values.comment.trim() || null,
      recurrenceId: null,
      createdBy: values.personId,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      deletedBy: null,
    }
    addTransaction(transaction)
    reset()
    onClose()
  }

  const visibleCategories = categories.filter((category) => category.type === type)

  return createPortal(
    <div
      className="sheet-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section className="transaction-sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
        <span className="sheet-handle" aria-hidden="true" />
        <h2 id="sheet-title">Нова операція</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="sheet-type-toggle" aria-label="Тип операції">
            {(['expense', 'income'] as TransactionType[]).map((value) => (
              <button
                className={type === value ? 'is-active' : ''}
                key={value}
                type="button"
                onClick={() => {
                  setValue('type', value)
                  setValue('categoryId', value === 'expense' ? 'food' : 'salary')
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
                {visibleCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
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
                {people.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}
              </select>
              <ChevronRight size={14} />
            </label>
          </div>

          <button className="sheet-submit interactive" disabled={isSubmitting} type="submit">Додати операцію</button>
        </form>
      </section>
    </div>,
    document.getElementById('sheet-root')!,
  )
}
