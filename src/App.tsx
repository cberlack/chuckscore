import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import AddEntry from './components/AddEntry'
import EntryList from './components/EntryList'
import EntryDetail from './components/EntryDetail'

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>ChuckScore 📊</h1>
        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/add">Add Entry</Link>
          <Link to="/entries">Entries</Link>
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddEntry />} />
          <Route path="/entries" element={<EntryList />} />
          <Route path="/entries/:id" element={<EntryDetail />} />
        </Routes>
      </main>
    </div>
  )
}
