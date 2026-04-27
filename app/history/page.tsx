import { prisma } from '@/lib/prisma'
import Link from 'next/link'

// SSR: carga el historial desde el servidor
export default async function HistoryPage() {
  const battles = await prisma.battle.findMany({
    include: {
      character1: true,
      character2: true,
      winner: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-3xl mx-auto">

        <Link href="/" className="text-gray-400 hover:text-white text-sm mb-6 block">
          ← Volver al inicio
        </Link>

        <h1 className="text-3xl font-bold mb-2 text-center">📜 Historial de Batallas</h1>
        <p className="text-center text-gray-400 mb-8">
          {battles.length} batalla{battles.length !== 1 ? 's' : ''} registrada{battles.length !== 1 ? 's' : ''}
        </p>

        {battles.length === 0 ? (
          <div className="text-center text-gray-500 mt-16">
            <p className="text-5xl mb-4">⚔️</p>
            <p>No hay batallas aún.</p>
            <Link href="/battles" className="text-purple-400 hover:underline mt-2 block">
              ¡Ejecuta la primera batalla!
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {battles.map((battle, index) => (
              <div key={battle.id}
                className="bg-gray-800 rounded-xl p-5 border border-gray-700">

                <div className="flex justify-between items-start mb-3">
                  <span className="text-gray-400 text-sm">Batalla #{battles.length - index}</span>
                  <span className="text-gray-500 text-xs">
                    {new Date(battle.createdAt).toLocaleString('es-CO')}
                  </span>
                </div>

                <div className="flex items-center justify-between">

                  {/* Personaje 1 */}
                  <div className={`text-center flex-1 p-3 rounded-lg ${
                    battle.winner.id === battle.character1.id
                      ? 'bg-yellow-900 border border-yellow-600'
                      : 'bg-gray-700'
                  }`}>
                    <p className="font-bold">{battle.character1.name}</p>
                    <p className="text-xs text-gray-400">
                      {battle.character1.type === 'zombie' ? '🧟 Zombie' : '🤖 Robot'}
                    </p>
                    {battle.winner.id === battle.character1.id && (
                      <p className="text-yellow-400 text-xs font-bold mt-1">🏆 GANADOR</p>
                    )}
                  </div>

                  {/* VS */}
                  <div className="text-center px-4">
                    <p className="text-red-400 font-black text-xl">VS</p>
                    <p className="text-gray-500 text-xs mt-1">{battle.turns} turnos</p>
                  </div>

                  {/* Personaje 2 */}
                  <div className={`text-center flex-1 p-3 rounded-lg ${
                    battle.winner.id === battle.character2.id
                      ? 'bg-yellow-900 border border-yellow-600'
                      : 'bg-gray-700'
                  }`}>
                    <p className="font-bold">{battle.character2.name}</p>
                    <p className="text-xs text-gray-400">
                      {battle.character2.type === 'zombie' ? '🧟 Zombie' : '🤖 Robot'}
                    </p>
                    {battle.winner.id === battle.character2.id && (
                      <p className="text-yellow-400 text-xs font-bold mt-1">🏆 GANADOR</p>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}