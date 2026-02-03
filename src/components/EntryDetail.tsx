import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { db } from '../db'
import { Entry } from '../types'

export default function EntryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [entry, setEntry] = useState<Entry | null>(null)

  useEffect(() => {
    if (!id) return
    db.entries.get(id).then((e) => setEntry(e ?? null))
  }, [id])

  async function remove() {
    if (!entry) return
    await db.entries.delete(entry.id)
    navigate('/')
  }

  if (!entry) return <div className="card">Not found</div>

  return (
    <div className="card">
      <h3>{entry.place ?? 'Untitled'}</h3>
      <div className="small">{new Date(entry.timestamp).toLocaleString()}</div>
      <div style={{ marginTop: 12 }}>
        <strong>Overall:</strong> {entry.overall.toFixed(1)} ⭐
      </div>
      <div style={{ marginTop: 8 }}>
        {entry.ratings.map((r) => (
          <div key={r.category} className="small">{r.category}: {r.stars} ⭐</div>
        ))}
      </div>
      {entry.notes && (
        <div style={{ marginTop: 12 }}>
          <strong>Notes</strong>
          <p>{entry.notes}</p>
        </div>
      )}
      <div style={{ marginTop: 12 }}>
        <button className="button" onClick={remove}>Delete</button>
      </div>
    </div>
  )
}
