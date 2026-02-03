import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../db'
import { Entry } from '../types'

export default function EntryList() {
  const [entries, setEntries] = useState<Entry[]>([])

  useEffect(() => {
    const load = async () => setEntries(await db.entries.orderBy('timestamp').reverse().toArray())
    load()
    const sub = db.on('changes', load)
    return () => db.on('changes').unsubscribe(sub as any)
  }, [])

  return (
    <div className="card">
      <h3>All Entries</h3>
      {entries.map((e) => (
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
  )
}
