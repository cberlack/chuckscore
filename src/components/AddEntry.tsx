import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../db'
import { Entry, Rating } from '../types'

const defaultCategories = ['Overall', 'Food', 'Comfort', 'Service', 'Value']

export default function AddEntry() {
  const navigate = useNavigate()
  const [place, setPlace] = useState('')
  const [notes, setNotes] = useState('')
  const [ratings, setRatings] = useState<Rating[]>(
    defaultCategories.map((c) => ({ category: c, stars: 4 }))
  )

  function setStars(category: string, stars: number) {
    setRatings((r) => r.map((x) => (x.category === category ? { ...x, stars } : x)))
  }

  async function save() {
    const overall =
      Math.round((ratings.reduce((s, r) => s + r.stars, 0) / ratings.length) * 10) / 10
    const entry: Entry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      place,
      ratings,
      overall,
      notes,
      tags: []
    }
    await db.entries.add(entry)
    navigate('/')
  }

  return (
    <div className="card">
      <h2>Add ChuckScore</h2>
      <div className="form-row">
        <label>Place</label>
        <input value={place} onChange={(e) => setPlace(e.target.value)} placeholder="Where?" />
      </div>

      {ratings.map((r) => (
        <div className="form-row" key={r.category}>
          <label>{r.category}</label>
          <select value={r.stars} onChange={(e) => setStars(r.category, Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n} ⭐</option>
            ))}
          </select>
        </div>
      ))}

      <div className="form-row">
        <label>Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button className="button" onClick={save}>Save</button>
      </div>
    </div>
  )
}
