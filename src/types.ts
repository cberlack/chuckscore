export type Rating = {
  category: string
  stars: number // 1-5
}

export type Entry = {
  id: string
  timestamp: string // ISO
  place?: string
  location?: {
    lat: number
    lng: number
  }
  ratings: Rating[]
  overall: number
  notes?: string
  tags?: string[]
}
