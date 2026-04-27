import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Historial de batallas
export async function GET() {
  const battles = await prisma.battle.findMany({
    include: {
      character1: true,
      character2: true,
      winner: true,
    },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(battles)
}

// POST - Ejecutar una batalla
export async function POST(request: Request) {
  const { character1Id, character2Id } = await request.json()

  const char1 = await prisma.character.findUnique({ where: { id: character1Id } })
  const char2 = await prisma.character.findUnique({ where: { id: character2Id } })

  if (!char1 || !char2) {
    return NextResponse.json({ error: 'Personajes no encontrados' }, { status: 404 })
  }

  // --- Lógica de combate ---
  let hp1 = char1.health
  let hp2 = char2.health
  let turns = 0

  // El más rápido ataca primero
  const firstAttacker = char1.speed >= char2.speed ? char1 : char2
  const secondAttacker = firstAttacker.id === char1.id ? char2 : char1
  let firstHp  = firstAttacker.id === char1.id ? hp1 : hp2
  let secondHp = firstAttacker.id === char1.id ? hp2 : hp1

  while (firstHp > 0 && secondHp > 0) {
    turns++
    // Primero ataca
    const dmg1 = Math.max(1, firstAttacker.attack - secondAttacker.defense * 0.5)
    secondHp -= dmg1
    if (secondHp <= 0) break

    // Segundo ataca
    const dmg2 = Math.max(1, secondAttacker.attack - firstAttacker.defense * 0.5)
    firstHp -= dmg2
  }

  const winnerId = firstHp > 0 ? firstAttacker.id : secondAttacker.id

  // Guardar batalla en BD
  const battle = await prisma.battle.create({
    data: {
      character1Id: char1.id,
      character2Id: char2.id,
      winnerId,
      turns,
    },
    include: {
      character1: true,
      character2: true,
      winner: true,
    }
  })

  return NextResponse.json(battle, { status: 201 })
}