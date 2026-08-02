import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { RouteStatus } from '../components/auth/RouteStatus'
import { useAuth } from '../context/auth-context'
import { useSpaces } from '../context/space-context'
import { getSupabase } from '../lib/supabase'

export function AuthCallbackPage() {
  const navigate = useNavigate()
  const { configured, loading: authLoading, user } = useAuth()
  const { activeSpace, loading: spacesLoading, refreshSpaces } = useSpaces()
  const [exchangeDone, setExchangeDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const finishExchange = async () => {
      if (!configured) throw new Error('Supabase не налаштовано для цього середовища.')
      const client = getSupabase()
      const code = new URLSearchParams(window.location.search).get('code')
      const { data } = await client.auth.getSession()

      if (code && !data.session) {
        const { error: exchangeError } = await client.auth.exchangeCodeForSession(code)
        if (exchangeError) throw exchangeError
      }

      if (active) setExchangeDone(true)
    }

    void finishExchange().catch((reason: unknown) => {
      if (active) {
        setError(reason instanceof Error ? reason.message : 'Не вдалося завершити вхід.')
        setExchangeDone(true)
      }
    })

    return () => { active = false }
  }, [configured])

  useEffect(() => {
    if (!exchangeDone || authLoading || spacesLoading || error) return
    if (!user) {
      setError('Сесію Google не знайдено. Спробуйте увійти ще раз.')
      return
    }

    void refreshSpaces().then((spaces) => {
      navigate(spaces.length || activeSpace ? '/app' : '/onboarding', { replace: true })
    }).catch((reason: unknown) => {
      setError(reason instanceof Error ? reason.message : 'Не вдалося завантажити ваш простір.')
    })
  }, [activeSpace, authLoading, error, exchangeDone, navigate, refreshSpaces, spacesLoading, user])

  if (error) {
    return (
      <main className="entry-screen route-status route-status--error">
        <p>{error}</p>
        <button className="onboarding-continue interactive" type="button" onClick={() => navigate('/welcome', { replace: true })}>
          Спробувати ще раз
        </button>
      </main>
    )
  }

  return <RouteStatus message="Завершуємо вхід…" />
}
