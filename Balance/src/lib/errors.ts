interface ErrorLike {
  code?: string
  message?: string
}

function asErrorLike(reason: unknown): ErrorLike {
  if (reason instanceof Error) return reason
  if (reason && typeof reason === 'object') return reason as ErrorLike
  return {}
}

export function transactionErrorMessage(reason: unknown, fallback: string) {
  const { code = '', message = '' } = asErrorLike(reason)
  const normalized = `${code} ${message}`.toLocaleLowerCase('uk-UA')

  if (!navigator.onLine || /failed to fetch|networkerror|network request|fetch failed/.test(normalized)) {
    return 'Немає зв’язку з ARQ. Перевірте інтернет і спробуйте ще раз.'
  }
  if (/jwt|session|refresh_token|not authenticated|authentication required/.test(normalized)) {
    return 'Сесія завершилася. Увійдіть до ARQ ще раз.'
  }
  if (/42501|permission|not allowed|mutation_not_allowed|space_membership_required/.test(normalized)) {
    return 'У вас немає дозволу змінювати цю операцію.'
  }
  if (/pgrst116|not found|no rows/.test(normalized)) {
    return 'Операцію вже змінено або видалено іншим учасником.'
  }
  if (/23514|transaction_|amount|category/.test(normalized)) {
    return 'Перевірте суму, категорію та учасника операції.'
  }

  return fallback
}
