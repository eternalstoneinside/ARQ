import {
  ArrowLeft,
  Bell,
  ChevronRight,
  CircleHelp,
  CircleUserRound,
  Languages,
  LockKeyhole,
  LogOut,
  MoonStar,
  ShieldCheck,
  WalletCards,
} from 'lucide-react'
import { useNavigate } from 'react-router'

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

export function SettingsPage() {
  const navigate = useNavigate()

  return (
    <article className="subpage settings-page">
      <header className="simple-header simple-header--centered">
        <button className="icon-button interactive" type="button" onClick={() => navigate(-1)} aria-label="Назад"><ArrowLeft size={18} /></button>
        <h1>Налаштування</h1>
        <span />
      </header>

      <section className="settings-section profile-section">
        <h2>Профіль</h2>
        <div className="profile-summary">
          <span className="avatar avatar--1">О</span>
          <span><strong>Олена</strong><small>olena@example.com</small></span>
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

      <button className="danger-link" type="button"><LogOut size={16} />Вийти з акаунту</button>
      <span className="settings-security"><ShieldCheck size={13} />Дані зберігаються лише у демоверсії</span>
    </article>
  )
}
