import { prisma } from '@/lib/prisma'
import BattleClient from './BattleClient'

// SSR: carga los personajes desde el servidor
export default async function BattlesPage() {
  const characters = await prisma.character.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <BattleClient characters={characters} />
      </div>
    </main>
  )
}