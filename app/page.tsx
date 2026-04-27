import { prisma } from '@/lib/prisma'
import Link from 'next/link'

// SSR: esta función se ejecuta en el servidor en cada petición
export default async function Home() {
  const characters = await prisma.character.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-2">⚔️ Zombies vs Robots</h1>
      <p className="text-center text-gray-400 mb-8">Simulador de Batallas</p>

      <div className="flex gap-4 justify-center mb-8">
        <Link href="/characters/new"
          className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-semibold">
          + Crear Personaje
        </Link>
        <Link href="/battles"
          className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-semibold">
          ⚔️ Ir a Batallas
        </Link>
        <Link href="/history"
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold">
          📜 Historial
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {characters.map((char) => (
          <div key={char.id}
            className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-xl font-bold">{char.name}</h2>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                char.type === 'zombie'
                  ? 'bg-green-900 text-green-300'
                  : 'bg-blue-900 text-blue-300'
              }`}>
                {char.type === 'zombie' ? '🧟 Zombie' : '🤖 Robot'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
              <span>❤️ Vida: <strong>{char.health}</strong></span>
              <span>⚔️ Ataque: <strong>{char.attack}</strong></span>
              <span>🛡️ Defensa: <strong>{char.defense}</strong></span>
              <span>💨 Velocidad: <strong>{char.speed}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {characters.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No hay personajes aún. ¡Crea el primero!
        </p>
      )}
    </main>
  )
}