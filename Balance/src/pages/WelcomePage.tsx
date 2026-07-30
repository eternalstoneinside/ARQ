import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ArqWordmark } from '../components/brand/ArqWordmark'

function GoogleMark() {
  return (
    <svg className="google-mark" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h6a5.1 5.1 0 0 1-2.2 3.3v2.7h3.6c2.1-2 3.2-4.8 3.2-7.9Z" />
      <path fill="#34A853" d="M12 23c3 0 5.5-1 7.4-2.9l-3.6-2.7c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.7H2v2.8A11.2 11.2 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.7 13.8A6.7 6.7 0 0 1 5.3 12c0-.6.1-1.2.4-1.8V7.4H2A11 11 0 0 0 .8 12c0 1.7.4 3.2 1.2 4.6l3.7-2.8Z" />
      <path fill="#EA4335" d="M12 5.5c1.6 0 3.1.6 4.3 1.7l3.2-3.2A10.8 10.8 0 0 0 12 1 11.2 11.2 0 0 0 2 7.4l3.7 2.8c.9-2.7 3.4-4.7 6.3-4.7Z" />
    </svg>
  )
}

export function WelcomePage() {
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const showUnavailable = () => {
    setMessage('Google-авторизацію буде підключено на наступному етапі.')
  }

  const showDocumentStatus = (document: string) => {
    setMessage(`${document} готуються до публікації.`)
  }

  return (
    <main className="entry-screen welcome-screen">
      <section className="welcome-copy entry-reveal">
        <ArqWordmark compact />
        <img
          className="welcome-art"
          src={`${import.meta.env.BASE_URL}assets/welcome-balance-sculpture-v2.webp`}
          alt=""
          width="480"
          height="350"
          decoding="async"
        />
        <h1>Спільні фінанси.<br />Без хаосу.</h1>
        <p>ARQ Balance допомагає спокійно вести спільний баланс, бачити внески й зберігати одну зрозумілу історію.</p>
      </section>

      <section className="welcome-actions entry-reveal entry-reveal--delayed" aria-label="Авторизація">
        <button className="google-button interactive" type="button" onClick={showUnavailable}>
          <GoogleMark />
          <span>Продовжити з Google</span>
        </button>
        <button className="guest-button interactive" type="button" onClick={() => navigate('/app')}>
          Продовжити без входу
        </button>

        <p className="legal-copy">
          Продовжуючи, ви погоджуєтесь з{' '}
          <button type="button" onClick={() => showDocumentStatus('Умови використання')}>Умовами використання</button>
          {' '}та{' '}
          <button type="button" onClick={() => showDocumentStatus('Політика конфіденційності')}>Політикою конфіденційності</button>.
        </p>
        <p className="entry-status" role="status" aria-live="polite">{message}</p>
      </section>
    </main>
  )
}
