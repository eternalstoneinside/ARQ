import { createContext, useContext } from 'react'

export interface PrivacyContextValue {
  moneyVisible: boolean
  toggleMoneyVisibility: () => void
}

export const PrivacyContext = createContext<PrivacyContextValue | null>(null)

export function useFinancialPrivacy() {
  const context = useContext(PrivacyContext)
  if (!context) throw new Error('useFinancialPrivacy має використовуватися в PrivacyProvider')
  return context
}
