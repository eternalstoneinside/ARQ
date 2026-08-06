import {
  ArrowLeft,
  Bell,
  ChevronRight,
  CircleHelp,
  CircleUserRound,
  Languages,
  Layers3,
  LockKeyhole,
  LogOut,
  MoonStar,
  ShieldCheck,
  UsersRound,
  WalletCards,
} from 'lucide-react'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import { useAuth } from '../context/auth-context'
import { useSpaces } from '../context/space-context'

const profileItems = [
  { icon: CircleUserRound, title: 'Особисті дані' },
  { icon: LockKeyhole, title: 'Безпека' },
  { icon: Bell, title: 'Сповіщення' },
]

const productItems = [
  { icon: WalletCards, title: 'Валюта', detail: 'PLN' },
  { icon: MoonStar, title: 'Тема', detail: 'Світла' },
  { icon: Languages, title: 'Мова', detail: 'Українська' },
  { icon: CircleHelp, title: 'Про додаток', detail: 'Версія 1.0.0' },
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
      <header className="simple-header simple-header--centered">
        <button className="icon-button interactive" type="button" onClick={() => navigate('/app', { replace: true })} aria-label="Назад"><ArrowLeft size={18} /></button>
        <h1>Налаштування</h1>
        <span />
      </header>

      <section className="settings-page__intro">
        <span>ARQ Balance</span>
        <h2>Ваші налаштування.</h2>
        <p>Особисті параметри та керування спільним простором.</p>
      </section>

      <section className="settings-section profile-section">
        <h2>Профіль</h2>
        <div className="profile-summary">
          <span className="avatar avatar--1">{initials}</span>
          <span><strong>{displayName}</strong><small>{user?.email ?? ''}</small></span>
        </div>
        <div className="settings-list">
          {profileItems.map(({ icon: Icon, title }) => (
            <button type="button" key={title}>
              <Icon size={17} strokeWidth={1.55} />
              <strong>{title}</strong>
              <ChevronRight size={14} />
            </button>
          ))}
        </div>
      </section>

      <section className="settings-section settings-space-section">
        <div className="settings-section__heading">
          <h2>Простір</h2>
          <span>{activeSpace?.name ?? 'Не обрано'}</span>
        </div>
        <div className="settings-list">
          <button type="button" onClick={() => navigate('/app/members', { state: { fromSettings: true } })}>
            <UsersRound size={17} strokeWidth={1.55} />
            <span>
              <strong>Учасники та запрошення</strong>
              <small>Доступ до активного простору</small>
            </span>
            <ChevronRight size={14} />
          </button>
          <button type="button" onClick={() => navigate('/app/settings/spaces', { state: { fromSettings: true } })}>
            <Layers3 size={17} strokeWidth={1.55} />
            <span>
              <strong>Керування просторами</strong>
              <small>{formatSpaceCount(spaces.length)}</small>
            </span>
            <ChevronRight size={14} />
          </button>
        </div>
      </section>

      <section className="settings-section">
        <h2>Продукт</h2>
        <div className="settings-list">
          {productItems.map(({ icon: Icon, title, detail }) => (
            <button type="button" key={title}>
              <Icon size={17} strokeWidth={1.55} />
              <strong>{title}</strong>
              <small>{detail}</small>
              <ChevronRight size={14} />
            </button>
          ))}
        </div>
      </section>

      <button className="danger-link" type="button" disabled={signingOut} onClick={() => void handleSignOut()}><LogOut size={16} />{signingOut ? 'Виходимо…' : 'Вийти з акаунту'}</button>
      <span className="settings-security"><ShieldCheck size={13} />Простір захищено політиками доступу</span>
    </article>
  )
}
