import { useEffect, useMemo, useRef, useState } from 'react'
import { createId, createStarterSlots, isValidSlot, loadSlots, localDateValue, saveSlots, STORAGE_KEY } from './storage'

const emptyForm = { role: '', date: '', serviceTime: '' }

function CalendarIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M7 2v3M17 2v3M3.5 9h17M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" /></svg>
}

function ClockIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></svg>
}

function UsersIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 5.5a3 3 0 0 1 0 5.8M16.5 14a4.8 4.8 0 0 1 4 5" /></svg>
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(
    new Date(`${value}T12:00:00`),
  )
}

function formatTime(value) {
  const [hours, minutes] = value.split(':').map(Number)
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(
    new Date(2020, 0, 1, hours, minutes),
  )
}

function SlotCard({ slot, onSignUp, onRemoveVolunteer, onEdit, onDelete }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const filled = Boolean(slot.volunteerName)

  function submit(event) {
    event.preventDefault()
    const normalized = name.trim().replace(/\s+/g, ' ')
    if (!normalized) {
      setError('Please enter your name.')
      return
    }
    onSignUp(slot.id, normalized)
    setName('')
    setError('')
  }

  return (
    <article className={`slot-card ${filled ? 'is-filled' : ''}`}>
      <div className="card-heading">
        <span className={`status ${filled ? 'filled' : 'open'}`}><span />{filled ? 'Filled' : 'Open'}</span>
        <div className="card-actions">
          <button className="icon-button" onClick={() => onEdit(slot)} aria-label={`Edit ${slot.role}`} title="Edit slot">✎</button>
          <button className="icon-button danger" onClick={() => onDelete(slot)} aria-label={`Delete ${slot.role}`} title="Delete slot">×</button>
        </div>
      </div>
      <h3>{slot.role}</h3>
      <div className="slot-meta">
        <span><CalendarIcon />{formatDate(slot.date)}</span>
        <span><ClockIcon />{formatTime(slot.serviceTime)} service</span>
      </div>
      {filled ? (
        <div className="volunteer-row">
          <div className="avatar">{slot.volunteerName.charAt(0).toUpperCase()}</div>
          <div><small>Serving</small><strong>{slot.volunteerName}</strong></div>
          <button className="text-button" onClick={() => onRemoveVolunteer(slot)}>Reopen</button>
        </div>
      ) : (
        <form className="signup-form" onSubmit={submit} noValidate>
          <label htmlFor={`name-${slot.id}`} className="sr-only">Your name for {slot.role}</label>
          <input
            id={`name-${slot.id}`}
            value={name}
            onChange={(event) => { setName(event.target.value); if (error) setError('') }}
            placeholder="Your name"
            autoComplete="name"
            aria-describedby={error ? `error-${slot.id}` : undefined}
          />
          <button className="primary-button" type="submit">I’ll serve</button>
          {error && <p className="field-error" id={`error-${slot.id}`}>{error}</p>}
        </form>
      )}
    </article>
  )
}

function SlotForm({ initialSlot, onSave, onCancel }) {
  const [form, setForm] = useState(initialSlot ? {
    role: initialSlot.role,
    date: initialSlot.date,
    serviceTime: initialSlot.serviceTime,
  } : emptyForm)
  const [errors, setErrors] = useState({})
  const firstInput = useRef(null)

  useEffect(() => { firstInput.current?.focus() }, [])

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  function submit(event) {
    event.preventDefault()
    const nextErrors = {}
    const role = form.role.trim().replace(/\s+/g, ' ')
    if (!role) nextErrors.role = 'Enter a ministry role.'
    if (!form.date) nextErrors.date = 'Choose a date.'
    else if (form.date < localDateValue()) nextErrors.date = 'Choose today or a future date.'
    if (!form.serviceTime) nextErrors.serviceTime = 'Choose a service time.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    onSave({ ...form, role })
  }

  return (
    <section className="slot-form-panel" aria-labelledby="slot-form-title">
      <div>
        <p className="eyebrow">Plan the team</p>
        <h2 id="slot-form-title">{initialSlot ? 'Edit ministry slot' : 'Add a ministry slot'}</h2>
        <p>{initialSlot ? 'Update the details for this opportunity.' : 'Create a new opportunity for someone to serve.'}</p>
      </div>
      <form className="slot-form" onSubmit={submit} noValidate>
        <label>Ministry role
          <input ref={firstInput} value={form.role} onChange={(event) => update('role', event.target.value)} placeholder="e.g. Welcome Team" />
          {errors.role && <span className="field-error">{errors.role}</span>}
        </label>
        <label>Date
          <input type="date" min={localDateValue()} value={form.date} onChange={(event) => update('date', event.target.value)} />
          {errors.date && <span className="field-error">{errors.date}</span>}
        </label>
        <label>Service time
          <input type="time" value={form.serviceTime} onChange={(event) => update('serviceTime', event.target.value)} />
          {errors.serviceTime && <span className="field-error">{errors.serviceTime}</span>}
        </label>
        <div className="form-buttons">
          <button className="primary-button" type="submit">{initialSlot ? 'Save changes' : 'Add slot'}</button>
          <button className="secondary-button" type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </section>
  )
}

export default function App() {
  const [slots, setSlots] = useState(loadSlots)
  const [showForm, setShowForm] = useState(false)
  const [editingSlot, setEditingSlot] = useState(null)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    function sync(event) {
      if (event.key !== STORAGE_KEY || !event.newValue) return
      try {
        const next = JSON.parse(event.newValue)
        if (Array.isArray(next) && next.every(isValidSlot)) setSlots(next)
      } catch { /* Ignore malformed updates from another tab. */ }
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  function commit(next, message) {
    setSlots(next)
    const persisted = saveSlots(next)
    setNotice(persisted ? message : `${message} Changes will last for this session only.`)
  }

  const orderedSlots = useMemo(() => [...slots].sort((a, b) => {
    const statusOrder = Number(Boolean(a.volunteerName)) - Number(Boolean(b.volunteerName))
    return statusOrder || `${a.date}${a.serviceTime}`.localeCompare(`${b.date}${b.serviceTime}`) || a.role.localeCompare(b.role)
  }), [slots])
  const openCount = slots.filter((slot) => !slot.volunteerName).length

  function signUp(id, name) {
    const next = slots.map((slot) => slot.id === id && !slot.volunteerName ? { ...slot, volunteerName: name } : slot)
    commit(next, `Thanks, ${name}! You’re signed up.`)
  }

  function removeVolunteer(slot) {
    if (!window.confirm(`Reopen the ${slot.role} slot currently filled by ${slot.volunteerName}?`)) return
    commit(slots.map((item) => item.id === slot.id ? { ...item, volunteerName: '' } : item), `${slot.role} is open again.`)
  }

  function deleteSlot(slot) {
    if (!window.confirm(`Delete the ${slot.role} slot? This cannot be undone.`)) return
    commit(slots.filter((item) => item.id !== slot.id), `${slot.role} was deleted.`)
  }

  function saveSlot(values) {
    if (editingSlot) {
      commit(slots.map((slot) => slot.id === editingSlot.id ? { ...slot, ...values } : slot), `${values.role} was updated.`)
    } else {
      commit([...slots, { ...values, id: createId(), volunteerName: '', createdAt: new Date().toISOString() }], `${values.role} was added.`)
    }
    setShowForm(false)
    setEditingSlot(null)
  }

  function resetBoard() {
    if (!window.confirm('Reset the board? All current slots and sign-ups in this browser will be replaced.')) return
    commit(createStarterSlots(), 'The sample board was restored.')
  }

  function openEdit(slot) {
    setEditingSlot(slot)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Volunteer Board home">
          <span className="brand-mark"><UsersIcon /></span>
          <span>Volunteer Board<small>Serve together</small></span>
        </a>
        <button className="add-button" onClick={() => { setEditingSlot(null); setShowForm(true) }}><span>+</span> Add a slot</button>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">There’s a place for you</p>
            <h1>Help make Sunday feel like <em>home.</em></h1>
            <p>Choose a ministry opportunity, add your name, and serve alongside your church family.</p>
            <a href="#opportunities" className="hero-link">See open opportunities <span>↓</span></a>
          </div>
          <div className="hero-stat" aria-label={`${openCount} open opportunities`}>
            <span>{String(openCount).padStart(2, '0')}</span>
            <p>open<br />opportunities</p>
          </div>
        </section>

        {showForm && <SlotForm initialSlot={editingSlot} onSave={saveSlot} onCancel={() => { setShowForm(false); setEditingSlot(null) }} />}

        <section className="board" id="opportunities" aria-labelledby="board-title">
          <div className="section-heading">
            <div><p className="eyebrow">Upcoming Sundays</p><h2 id="board-title">Find your place to serve</h2></div>
            <p>{openCount} open · {slots.length - openCount} filled</p>
          </div>
          {orderedSlots.length ? (
            <div className="slot-grid">
              {orderedSlots.map((slot) => <SlotCard key={slot.id} slot={slot} onSignUp={signUp} onRemoveVolunteer={removeVolunteer} onEdit={openEdit} onDelete={deleteSlot} />)}
            </div>
          ) : (
            <div className="empty-state"><span>✦</span><h3>No ministry slots yet</h3><p>Add the first opportunity and invite someone to serve.</p><button className="primary-button" onClick={() => setShowForm(true)}>Add a slot</button></div>
          )}
        </section>
      </main>

      <footer>
        <div><strong>Thank you for serving.</strong><p>Every welcome, song, and helping hand makes a difference.</p></div>
        <div className="storage-note"><span aria-hidden="true">⌁</span><p><strong>Saved on this browser</strong><br />This board isn’t shared across devices.</p></div>
        <button className="text-button" onClick={resetBoard}>Reset sample board</button>
      </footer>
      <div className="toast" aria-live="polite" aria-atomic="true">{notice}</div>
    </div>
  )
}
