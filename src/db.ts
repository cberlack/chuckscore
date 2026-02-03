import Dexie, { Table } from 'dexie'
import { Entry } from './types'

export class ChuckDB extends Dexie {
  entries!: Table<Entry, string>

  constructor() {
    super('chuckscore-db')
    this.version(1).stores({ entries: 'id, timestamp, place' })
  }
}

export const db = new ChuckDB()

// Seed sample data if empty
export async function seedSample() {
  const count = await db.entries.count()
  if (count === 0) {
    await db.entries.add({
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      place: 'Sample Stadium',
      ratings: [
        { category: 'Overall', stars: 5 },
        { category: 'Food', stars: 4 },
        { category: 'Comfort', stars: 5 }
      ],
      overall: 4.7,
      notes: 'Great experience for the sample entry',
      tags: ['sample']
    })
  }
}
