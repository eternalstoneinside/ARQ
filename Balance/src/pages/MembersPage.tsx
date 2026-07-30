import { ArrowLeft, ChevronRight, Clock3, Coins, LogOut, UserPlus } from 'lucide-react'
import { useNavigate } from 'react-router'
import { people } from '../data/mock'

export function MembersPage() {
  const navigate = useNavigate()

  return (
    <article className="subpage">
      <header className="simple-header simple-header--centered">
        <button className="icon-button interactive" type="button" onClick={() => navigate(-1)} aria-label="Назад"><ArrowLeft size={18} /></button>
        <h1>Спільний простір</h1>
        <span />
      </header>

      <button className="space-card interactive" type="button">
        <span><strong>Дім Олени й Андрія</strong><small>2 учасники</small></span>
        <ChevronRight size={15} />
      </button>

      <section className="settings-section">
        <h2>Учасники</h2>
        <div className="settings-list">
          {people.map((person, index) => (
            <button type="button" key={person.id}>
              <span className={`avatar avatar--${index + 1}`}>{person.initials}</span>
              <span><strong>{person.name}</strong><small>{index === 0 ? 'Адміністратор' : 'Учасник'}</small></span>
              <ChevronRight size={14} />
            </button>
          ))}
          <button type="button" onClick={() => alert('Запрошення стане доступним після підключення облікового запису.')}>
            <UserPlus size={17} /><strong>Запросити учасника</strong><ChevronRight size={14} />
          </button>
        </div>
      </section>

      <section className="settings-section">
        <h2>Налаштування простору</h2>
        <div className="settings-list">
          <button type="button"><Coins size={17} /><strong>Валюта</strong><small>PLN</small><ChevronRight size={14} /></button>
          <button type="button"><Clock3 size={17} /><strong>Часовий пояс</strong><small>Europe / Warsaw</small><ChevronRight size={14} /></button>
        </div>
      </section>

      <button className="danger-link" type="button"><LogOut size={16} />Вийти з простору</button>
    </article>
  )
}
