import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Check, Copy, KeyRound, LogOut, MoreHorizontal, RefreshCw, ShieldCheck, UserPlus, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { MemberManagementSheet } from '../components/MemberManagementSheet'
import { useAuth } from '../context/auth-context'
import { useSpaces } from '../context/space-context'
import { fetchLatestInvite, fetchSpaceMembers, type SpaceInviteStatus, type SpaceMember } from '../lib/spaceMembers'
import {
  cardVariants,
  listVariants,
  pageVariants,
  reducedCardVariants,
  reducedPageVariants,
} from '../motion/motionTokens'

type SheetState = { mode: 'leave'; member: null } | { mode: 'member'; member: SpaceMember }

const inviteDateFormatter = new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'short' })

function initials(name: string) {
  const value = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
  return value.toLocaleUpperCase('uk-UA') || 'AR'
}

export function MembersPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const { user } = useAuth()
  const { activeSpace, createInvite, latestInviteCode, revokeInvite } = useSpaces()
  const [members, setMembers] = useState<SpaceMember[]>([])
  const [invite, setInvite] = useState<SpaceInviteStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [inviteWorking, setInviteWorking] = useState(false)
  const [copied, setCopied] = useState(false)
  const [sheet, setSheet] = useState<SheetState | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const noticeTimer = useRef<number | null>(null)
  const pageMotion = reduceMotion ? reducedPageVariants : pageVariants
  const rowMotion = reduceMotion ? reducedCardVariants : cardVariants
  const isOwner = activeSpace?.role === 'owner'
  const handleBack = () => {
    if (location.state?.fromSettings) {
      navigate(-1)
      return
    }
    navigate('/app/settings', { replace: true })
  }

  const loadData = useCallback(async () => {
    if (!activeSpace) {
      setMembers([])
      setInvite(null)
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const [nextMembers, nextInvite] = await Promise.all([
        fetchSpaceMembers(activeSpace.id),
        isOwner ? fetchLatestInvite(activeSpace.id) : Promise.resolve(null),
      ])
      setMembers(nextMembers)
      setInvite(nextInvite)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Не вдалося завантажити учасників.')
    } finally {
      setLoading(false)
    }
  }, [activeSpace, isOwner])

  useEffect(() => {
    void loadData()
  }, [loadData])

  useEffect(() => () => {
    if (noticeTimer.current !== null) window.clearTimeout(noticeTimer.current)
  }, [])

  const announce = (message: string) => {
    if (noticeTimer.current !== null) window.clearTimeout(noticeTimer.current)
    setNotice(message)
    noticeTimer.current = window.setTimeout(() => setNotice(null), 3600)
  }

  const handleCreateInvite = async () => {
    if (inviteWorking) return
    setInviteWorking(true)
    setError(null)
    try {
      await createInvite()
      setInvite(await fetchLatestInvite(activeSpace!.id))
      announce(invite?.active ? 'Створено новий код. Попередній код відкликано.' : 'Код запрошення створено.')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Не вдалося створити запрошення.')
    } finally {
      setInviteWorking(false)
    }
  }

  const handleCopy = async () => {
    if (!latestInviteCode) return
    try {
      await navigator.clipboard.writeText(latestInviteCode)
      setCopied(true)
      announce('Код скопійовано.')
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setError('Не вдалося скопіювати код. Виділіть його вручну.')
    }
  }

  const handleRevoke = async () => {
    if (inviteWorking) return
    setInviteWorking(true)
    setError(null)
    try {
      await revokeInvite()
      setInvite(await fetchLatestInvite(activeSpace!.id))
      announce('Запрошення відкликано.')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Не вдалося відкликати запрошення.')
    } finally {
      setInviteWorking(false)
    }
  }

  if (!activeSpace) {
    return (
      <article className="subpage members-page">
        <header className="simple-header simple-header--centered">
          <button className="icon-button interactive" type="button" onClick={handleBack} aria-label="Назад"><ArrowLeft size={18} /></button>
          <h1>Учасники</h1>
          <span />
        </header>
        <p className="members-page__error" role="alert">Спочатку оберіть або створіть простір.</p>
      </article>
    )
  }

  const inviteStatus = invite?.active ? 'Активне' : invite?.revokedAt ? 'Відкликане' : invite ? 'Завершене' : 'Не створено'

  return (
    <motion.article className="subpage members-page" variants={pageMotion} initial="hidden" animate="visible">
      <header className="simple-header simple-header--centered">
        <button className="icon-button interactive" type="button" onClick={handleBack} aria-label="Назад"><ArrowLeft size={18} /></button>
        <h1>Спільний простір</h1>
        <span />
      </header>

      <motion.section className="members-page__intro" variants={rowMotion}>
        <span>{isOwner ? 'Ви власник' : 'Ви учасник'}</span>
        <h2>{activeSpace.name}</h2>
        <p>{members.length || '—'} {members.length === 1 ? 'учасник' : members.length > 1 && members.length < 5 ? 'учасники' : 'учасників'} у спільному просторі.</p>
      </motion.section>

      {isOwner && (
        <motion.section className="members-invite" variants={rowMotion} aria-labelledby="invite-title">
          <header>
            <div>
              <span>Запрошення</span>
              <h2 id="invite-title">Доступ до простору</h2>
            </div>
            <em className={invite?.active ? 'is-active' : ''}>{inviteStatus}</em>
          </header>

          {latestInviteCode ? (
            <button className="members-invite__code interactive" type="button" onClick={() => void handleCopy()} aria-label="Скопіювати код запрошення">
              <KeyRound size={17} strokeWidth={1.55} />
              <span><small>Код запрошення</small><strong>{latestInviteCode}</strong></span>
              {copied ? <Check size={18} strokeWidth={1.7} /> : <Copy size={18} strokeWidth={1.55} />}
            </button>
          ) : (
            <div className="members-invite__quiet">
              <KeyRound size={17} strokeWidth={1.45} />
              <p>{invite?.active ? 'Активний код приховано з міркувань безпеки. Створіть новий, щоб скопіювати його.' : 'Створіть код і передайте його людині, яку хочете запросити.'}</p>
            </div>
          )}

          {invite && (
            <div className="members-invite__meta">
              <span>Використано {invite.usedCount} з {invite.maxUses}</span>
              <span>До {inviteDateFormatter.format(new Date(invite.expiresAt))}</span>
            </div>
          )}

          <div className="members-invite__actions">
            <button className="members-invite__primary interactive" type="button" disabled={inviteWorking} onClick={() => void handleCreateInvite()}>
              {invite?.active ? <RefreshCw size={15} strokeWidth={1.6} /> : <UserPlus size={15} strokeWidth={1.6} />}
              {inviteWorking ? 'Зачекайте…' : invite?.active ? 'Новий код' : 'Створити код'}
            </button>
            {invite?.active && (
              <button className="members-invite__secondary interactive" type="button" disabled={inviteWorking} onClick={() => void handleRevoke()}>
                <X size={15} strokeWidth={1.6} />Відкликати
              </button>
            )}
          </div>
        </motion.section>
      )}

      <motion.section className="members-collection" variants={rowMotion} aria-labelledby="members-title">
        <header>
          <h2 id="members-title">Учасники</h2>
          <span>{members.length}</span>
        </header>

        {loading ? (
          <div className="members-loading" aria-label="Завантаження учасників">
            <span /><span /><span />
          </div>
        ) : (
          <motion.div className="members-list" role="list" variants={listVariants} initial="hidden" animate="visible">
            {members.map((member) => {
              const isCurrentUser = member.userId === user?.id
              const canManage = isOwner && member.role !== 'owner' && !isCurrentUser
              const content = (
                <>
                  <span className="members-list__avatar">
                    {member.avatarUrl ? <img src={member.avatarUrl} alt="" referrerPolicy="no-referrer" /> : initials(member.displayName)}
                  </span>
                  <span className="members-list__copy">
                    <strong>{member.displayName}{isCurrentUser && <em>Ви</em>}</strong>
                    <small>{member.role === 'owner' ? 'Власник простору' : 'Учасник'}</small>
                  </span>
                  {canManage ? <MoreHorizontal size={19} strokeWidth={1.5} /> : member.role === 'owner' ? <ShieldCheck size={17} strokeWidth={1.45} /> : <span />}
                </>
              )

              return canManage ? (
                <motion.button className="members-list__row interactive" type="button" role="listitem" key={member.userId} variants={rowMotion} onClick={() => setSheet({ mode: 'member', member })} aria-label={`Керувати учасником ${member.displayName}`}>
                  {content}
                </motion.button>
              ) : (
                <motion.div className="members-list__row" role="listitem" key={member.userId} variants={rowMotion}>{content}</motion.div>
              )
            })}
          </motion.div>
        )}
      </motion.section>

      {error && <p className="members-page__error" role="alert">{error}</p>}

      {isOwner ? (
        <motion.p className="members-page__owner-note" variants={rowMotion}>
          Щоб вийти з простору, спочатку передайте право власника іншому учаснику або видаліть простір.
        </motion.p>
      ) : (
        <motion.button className="members-page__leave interactive" type="button" variants={rowMotion} onClick={() => setSheet({ mode: 'leave', member: null })}>
          <LogOut size={16} strokeWidth={1.55} />Вийти з простору
        </motion.button>
      )}

      <div className={`spaces-page__notice ${notice ? 'is-visible' : ''}`} role="status" aria-live="polite">{notice ?? ''}</div>

      <MemberManagementSheet
        open={Boolean(sheet)}
        mode={sheet?.mode ?? 'member'}
        member={sheet?.member ?? null}
        onClose={() => setSheet(null)}
        onCompleted={(result) => {
          if (result.kind === 'leave') {
            if (!result.remainingSpaces?.length) {
              navigate('/onboarding', { replace: true })
              return
            }
            navigate('/app', { replace: true })
            return
          }
          announce(result.message)
          void loadData()
        }}
      />
    </motion.article>
  )
}
