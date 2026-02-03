import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { db, seedSample } from '../db'
import { Entry } from '../types'

export default function Dashboard() {
  const [recent, setRecent] = useState<Entry[]>([])

  useEffect(() => {
    seedSample()
    const load = async () => {
      const r = await db.entries.orderBy('timestamp').reverse().limit(10).toArray()
      setRecent(r)
    }
    load()
    const sub = db.on('changes', load)
    return () => db.on('changes').unsubscribe(sub as any)
  }, [])

  async function exportJSON() {
    const all = await db.entries.toArray()
    const blob = new Blob([JSON.stringify(all, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'chuckscore-export.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  async function importJSON(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    const text = await f.text()
    try {
      const data = JSON.parse(text)
      await db.transaction('rw', db.entries, async () => {
        for (const item of data) {
          await db.entries.put(item)
        }
      })
      alert('Imported')
      window.location.reload()
    } catch (err) {
      alert('Invalid JSON')
    }
  }

  return (
    <div>
      <div className="card">
        <h2>Welcome to ChuckScore</h2>
        <p className="small">Log experiences with per-category ratings and a timestamp. Export/import via JSON.</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button className="button" onClick={exportJSON}>Export JSON</button>
          <label className="button">
            Import
            <input type="file" accept="application/json" onChange={importJSON} style={{ display: 'none' }} />
          </label>
          <Link to="/add" className="button">Add Entry</Link>
        </div>
      </div>

      <div className="card">
        <h3>Recent</h3>
        {recent.length === 0 && <p className="small">No entries yet</p>}
        {recent.map((e) => (
          <div key={e.id} className="entry">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <strong>{e.place ?? 'Untitled'}</strong>
                <div className="small">{new Date(e.timestamp).toLocaleString()}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div><strong>{e.overall.toFixed(1)}</strong> ⭐</div>
                <Link to={`/entries/${e.id}`}>View</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
