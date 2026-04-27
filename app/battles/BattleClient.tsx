'use client'

import { useState } from 'react'
import Link from 'next/link'

type Character = {
  id: number
  name: string
  type: string
  health: number
  attack: number
  defense: number
  speed: number
}

type BattleResult = {
  id: number
  turns: number
  winner: Character
  character1: Character
  character2: Character
}

export default function BattleClient({ characters }: { characters: Character[] }) {
  const [char1Id, setChar1Id] = useState('')
  const [char2Id, setChar2Id] = useState('')
  const [result, setResult] = useState<BattleResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleBattle = async () => {
    if (!char1Id || !char2Id) {
      setError('Debes seleccionar dos personajes')
      return
    }
    if (char1Id === char2Id) {
      setError('Debes seleccionar personajes diferentes')
      return
    }

    setError('')
    setLoading(true)
    setResult(null)

    const res = await fetch('/api/battles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        character1Id: Number(char1Id),
        character2Id: Number(char2Id),
      }),
    })

    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  const zombies = characters.filter((c) => c.type === 'zombie')
  const robots = characters.filter((c) => c.type === 'robot')

  const selectedChar1 = characters.find((c) => c.id === Number(char1Id))
  const selectedChar2 = characters.find((c) => c.id === Number(char2Id))

  return (
    <div>
      <Link href="/" className="text-gray-400 hover:text-white text-sm mb-6 block">
        ← Volver al inicio
      </Link>

      <h1 className="text-3xl font-bold mb-8 text-center">⚔️ Ejecutar Batalla</h1>

      {/* Selección de personajes */}
      <div className="grid grid-cols-2 gap-6 mb-6">

        {/* Personaje 1 */}
        <div className="bg-gray-800 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-3 text-green-400">🧟 Personaje 1</h2>
          <select
            value={char1Id}
            onChange={(e) => setChar1Id(e.target.value)}
            className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-green-500 mb-3"
          >
            <option value="">-- Seleccionar --</option>
            <optgroup label="🧟 Zombies">
              {zombies.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </optgroup>
            <optgroup label="🤖 Robots">
              {robots.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </optgroup>
          </select>

          {selectedChar1 && <CharStats char={selectedChar1} />}
        </div>

        {/* Personaje 2 */}
        <div className="bg-gray-800 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-3 text-blue-400">🤖 Personaje 2</h2>
          <select
            value={char2Id}
            onChange={(e) => setChar2Id(e.target.value)}
            className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          >
            <option value="">-- Seleccionar --</option>
            <optgroup label="🧟 Zombies">
              {zombies.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </optgroup>
            <optgroup label="🤖 Robots">
              {robots.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </optgroup>
          </select>

          {selectedChar2 && <CharStats char={selectedChar2} />}
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-400 text-center mb-4">{error}</p>
      )}

      {/* Botón de batalla */}
      <button
        onClick={handleBattle}
        disabled={loading}
        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 py-4 rounded-xl font-bold text-xl transition-colors mb-8"
      >
        {loading ? '⚔️ Combatiendo...' : '⚔️ ¡INICIAR BATALLA!'}
      </button>

      {/* Resultado */}
      {result && (
        <div className="bg-gray-800 border-2 border-yellow-500 rounded-xl p-6 text-center">
          <h2 className="text-2xl font-bold text-yellow-400 mb-2">🏆 ¡Resultado!</h2>
          <p className="text-4xl font-black mb-2">{result.winner.name}</p>
          <p className="text-gray-300 mb-1">
            {result.winner.type === 'zombie' ? '🧟 Zombie' : '🤖 Robot'} ganó la batalla
          </p>
          <p className="text-gray-400 text-sm">Duración: {result.turns} turnos</p>

          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={() => { setResult(null); setChar1Id(''); setChar2Id('') }}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-semibold"
            >
              Nueva Batalla
            </button>
            <Link
              href="/history"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold"
            >
              Ver Historial
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

// Componente auxiliar para mostrar stats
function CharStats({ char }: { char: Character }) {
  return (
    <div className="grid grid-cols-2 gap-1 text-sm text-gray-300">
      <span>❤️ Vida: <strong>{char.health}</strong></span>
      <span>⚔️ Ataque: <strong>{char.attack}</strong></span>
      <span>🛡️ Defensa: <strong>{char.defense}</strong></span>
      <span>💨 Velocidad: <strong>{char.speed}</strong></span>
    </div>
  )
}