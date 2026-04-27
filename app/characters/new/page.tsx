'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewCharacter() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    type: 'zombie',
    health: 100,
    attack: 20,
    defense: 10,
    speed: 10,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    await fetch('/api/characters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        health: Number(form.health),
        attack: Number(form.attack),
        defense: Number(form.defense),
        speed: Number(form.speed),
      }),
    })

    setLoading(false)
    router.push('/')
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-md mx-auto">

        <Link href="/" className="text-gray-400 hover:text-white text-sm mb-6 block">
          ← Volver al inicio
        </Link>

        <h1 className="text-3xl font-bold mb-8 text-center">➕ Crear Personaje</h1>

        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-6 space-y-5">

          {/* Nombre */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Nombre</label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Ej: Zombie Alpha"
              className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Tipo</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="zombie">🧟 Zombie</option>
              <option value="robot">🤖 Robot</option>
            </select>
          </div>

          {/* Stats */}
          {[
            { label: '❤️ Vida', name: 'health', min: 50, max: 200 },
            { label: '⚔️ Ataque', name: 'attack', min: 5, max: 50 },
            { label: '🛡️ Defensa', name: 'defense', min: 1, max: 30 },
            { label: '💨 Velocidad', name: 'speed', min: 1, max: 30 },
          ].map((stat) => (
            <div key={stat.name}>
              <label className="block text-sm text-gray-400 mb-1">
                {stat.label}: <strong>{form[stat.name as keyof typeof form]}</strong>
              </label>
              <input
                type="range"
                name={stat.name}
                min={stat.min}
                max={stat.max}
                value={form[stat.name as keyof typeof form]}
                onChange={handleChange}
                className="w-full accent-purple-500"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{stat.min}</span>
                <span>{stat.max}</span>
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 py-3 rounded-lg font-bold text-lg transition-colors"
          >
            {loading ? 'Creando...' : '✅ Crear Personaje'}
          </button>

        </form>
      </div>
    </main>
  )
}