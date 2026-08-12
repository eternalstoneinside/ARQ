import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { PrivacyContext } from './privacy-context'

const storageKey = 'arq-money-visible'

function initialVisibility() {
  try {
    return window.sessionStorage.getItem(storageKey) !== 'false'
  } catch {
    return true
  }
}

export function PrivacyProvider({ children }: { children: ReactNode }) {
  const [moneyVisible, setMoneyVisible] = useState(initialVisibility)

  const toggleMoneyVisibility = useCallback(() => {
    setMoneyVisible((current) => {
      const next = !current
      try {
        window.sessionStorage.setItem(storageKey, String(next))
      } catch {
        // Privacy still works for this render when storage is unavailable.
      }
      return next
    })
  }, [])

  const value = useMemo(() => ({ moneyVisible, toggleMoneyVisibility }), [moneyVisible, toggleMoneyVisibility])

  return <PrivacyContext.Provider value={value}>{children}</PrivacyContext.Provider>
}
