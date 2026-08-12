import {
  ArrowLeft,
  ChevronRight,
  Layers3,
  LogOut,
  ShieldCheck,
  UsersRound,
} from 'lucide-react'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import { useAuth } from '../context/auth-context'
import { useSpaces } from '../context/space-context'

const productFacts = [
  { label: 'Валюта', value: 'PLN' },
  { label: 'Мова', value: 'Українська' },
  { label: 'Тема', value: 'Світла' },
  { label: 'Версія', value: '1.0.0 beta' },
]

function formatSpaceCount(count: number) {
  const mod10 = count % 10
  const mod100 = count % 100
  const noun = mod10 === 1 && mod100 !== 11
    ? 'простір'
    : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)
      ? 'простори'
      : 'просторів'

  return `${count} ${noun}`
}

export function SettingsPage() {
  const navigate = useNavigate()
  const { signOut, user } = useAuth()
  const { activeSpace, spaces } = useSpaces()
  const [signingOut, setSigningOut] = useState(false)
  const displayName = String(user?.user_metadata.full_name ?? user?.user_metadata.name ?? 'Користувач ARQ')
  const initials = displayName.trim().slice(0, 1).toUpperCase() || 'A'

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await signOut()
      navigate('/welcome', { replace: true })
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <article className="subpage settings-page">
      <header className="simple-header simple-header--centered subpage-header">
        <button className="icon-button interactive" type="button" onClick={() => navigate('/app', { replace: true })} aria-label="Назад"><ArrowLeft size={19} strokeWidth={1.55} /></button>
        <h1>Налаштування</h1>
        <span />
      </header>

      <section className="settings-section profile-section">
        <h2>Профіль</h2>
        <div className="profile-summary">
          <span className="avatar avatar--1">{initials}</span>
          <span className="profile-summary__copy"><strong>{displayName}</strong><small>{user?.email ?? ''}</small></span>
        </div>
      </section>

      <section className="settings-section settings-space-section">
        <div className="settings-section__heading">
          <h2>Простір</h2>
          <span>{activeSpace?.name ?? 'Не обрано'}</span>
        </div>
        <div className="settings-list settings-list--actions">
          <button className="interactive" type="button" onClick={() => navigate('/app/members', { state: { fromSettings: true } })}>
            <UsersRound size={18} strokeWidth={1.45} />
            <span>
              <strong>Учасники й запрошення</strong>
              <small>Доступ до активного простору</small>
            </span>
            <ChevronRight size={15} strokeWidth={1.5} />
          </button>
          <button className="interactive" type="button" onClick={() => navigate('/app/settings/spaces', { state: { fromSettings: true } })}>
            <Layers3 size={18} strokeWidth={1.45} />
            <span>
              <strong>Керування просторами</strong>
              <small>{formatSpaceCount(spaces.length)}</small>
            </span>
            <ChevronRight size={15} strokeWidth={1.5} />
          </button>
        </div>
      </section>

      <section className="settings-section">
        <h2>Додаток</h2>
        <dl className="settings-facts">
          {productFacts.map(({ label, value }) => (
            <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
          ))}
        </dl>
      </section>

      <button className="danger-link interactive" type="button" disabled={signingOut} onClick={() => void handleSignOut()}><LogOut size={16} />{signingOut ? 'Виходимо…' : 'Вийти з акаунту'}</button>
      <span className="settings-security"><ShieldCheck size={13} />Дані простору захищені правилами доступу</span>
    </article>
  )
}
