type LegalNoticeProps = {
  className?: string
}

export function LegalNotice({ className = '' }: LegalNoticeProps) {
  return (
    <p className={`legal-notice ${className}`.trim()}>
      Продовжуючи, ви погоджуєтесь з{' '}
      <span>Умовами використання</span>
      {' '}та{' '}
      <span>Політикою конфіденційності</span>.
    </p>
  )
}
