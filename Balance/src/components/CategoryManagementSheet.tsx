import { Archive, Cat, Cigarette, CircleEllipsis, PawPrint, Plus, RotateCcw, Wifi } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { useCategories } from '../context/categories-context'
import { useAuth } from '../context/auth-context'
import { useSpaces } from '../context/space-context'
import type { SpaceCategory, TransactionType } from '../domain/types'
import { modalBackdropVariants, modalVariants, reducedModalVariants } from '../motion/motionTokens'
import { CategoryIcon } from './ui/CategoryIcon'

const iconOptions = [
  { id: 'CircleEllipsis', label: 'Інше', Icon: CircleEllipsis },
  { id: 'PawPrint', label: 'Тварина', Icon: PawPrint },
  { id: 'Cat', label: 'Улюбленець', Icon: Cat },
  { id: 'Cigarette', label: 'Сигарети', Icon: Cigarette },
  { id: 'Wifi', label: 'Інтернет', Icon: Wifi },
]

export function CategoryManagementSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { archiveCategory, categories, createCategory, error: loadError, restoreCategory, updateCategory } = useCategories()
  const { user } = useAuth()
  const { activeSpace } = useSpaces()
  const reduceMotion = useReducedMotion()
  const [editing, setEditing] = useState<SpaceCategory | null>(null)
  const [type, setType] = useState<TransactionType>('expense')
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('CircleEllipsis')
  const [working, setWorking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resetForm = () => {
    setEditing(null)
    setName('')
    setIcon('CircleEllipsis')
    setError(null)
  }

  useEffect(() => {
    if (!open) resetForm()
  }, [open])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !working) onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose, open, working])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim() || working) return
    setWorking(true)
    setError(null)
    try {
      if (editing) await updateCategory(editing.id, { icon, name })
      else await createCategory({ icon, name, type })
      resetForm()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Не вдалося зберегти категорію.')
    } finally {
      setWorking(false)
    }
  }

  const visible = categories.filter((category) => category.type === type)

  return createPortal(
    <AnimatePresence onExitComplete={resetForm}>
      {open && (
        <motion.div className="sheet-backdrop" variants={reduceMotion ? reducedModalVariants : modalBackdropVariants} initial="hidden" animate="visible" exit="exit" onMouseDown={(event) => event.target === event.currentTarget && !working && onClose()}>
          <motion.section className="space-sheet category-sheet" role="dialog" aria-modal="true" aria-labelledby="category-sheet-title" variants={reduceMotion ? reducedModalVariants : modalVariants} initial="hidden" animate="visible" exit="exit">
            <span className="sheet-handle" aria-hidden="true" />
            <header className="category-sheet__heading">
              <h2 id="category-sheet-title">Категорії простору</h2>
              <p>Власні назви бачать усі учасники. Архівування не змінює старі операції.</p>
            </header>

            <div className="sheet-type-toggle" aria-label="Тип категорії">
              {(['expense', 'income'] as TransactionType[]).map((value) => (
                <button className={type === value ? 'is-active' : ''} type="button" key={value} onClick={() => { setType(value); resetForm() }}>
                  {value === 'expense' ? 'Витрати' : 'Доходи'}
                </button>
              ))}
            </div>

            <form className="category-form" onSubmit={handleSubmit}>
              <label><span>{editing ? 'Нова назва' : 'Назва категорії'}</span><input value={name} onChange={(event) => setName(event.target.value)} maxLength={40} placeholder="Наприклад, Айва" /></label>
              <div className="category-icon-options" role="radiogroup" aria-label="Іконка категорії">
                {iconOptions.map(({ id, label, Icon }) => (
                  <button className={icon === id ? 'is-active' : ''} type="button" role="radio" aria-checked={icon === id} aria-label={label} key={id} onClick={() => setIcon(id)}><Icon size={17} strokeWidth={1.55} /></button>
                ))}
              </div>
              {(error || loadError) && <p className="sheet-error" role="alert">{error ?? loadError}</p>}
              <button className="sheet-submit interactive" type="submit" disabled={!name.trim() || working}><Plus size={16} />{working ? 'Зберігаємо…' : editing ? 'Зберегти зміни' : 'Додати категорію'}</button>
              {editing && <button className="category-form__cancel interactive" type="button" onClick={resetForm}>Скасувати редагування</button>}
            </form>

            <div className="category-manager-list">
              {visible.map((category) => (
                <div className={category.archivedAt ? 'is-archived' : ''} key={category.id}>
                  <button className="category-manager-list__main interactive" type="button" disabled={Boolean(category.archivedAt) || (category.createdBy !== user?.id && activeSpace?.role !== 'owner')} onClick={() => { setEditing(category); setName(category.name); setIcon(category.icon) }}>
                    <CategoryIcon icon={category.icon} type={category.type} size="sm" /><span><strong>{category.name}</strong><small>{category.isDefault ? 'Базова категорія' : 'Власна категорія'}{category.archivedAt ? ' · Архів' : ''}</small></span>
                  </button>
                  <button className="category-manager-list__action interactive" type="button" disabled={category.createdBy !== user?.id && activeSpace?.role !== 'owner'} aria-label={category.archivedAt ? `Відновити ${category.name}` : `Архівувати ${category.name}`} onClick={() => void (category.archivedAt ? restoreCategory(category.id) : archiveCategory(category.id)).catch((reason) => setError(reason instanceof Error ? reason.message : 'Не вдалося змінити категорію.'))}>
                    {category.archivedAt ? <RotateCcw size={16} /> : <Archive size={16} />}
                  </button>
                </div>
              ))}
            </div>
            <button className="space-sheet__dismiss interactive" type="button" onClick={onClose}>Закрити</button>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>,
    document.getElementById('sheet-root')!,
  )
}
