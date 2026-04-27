import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar personajes (con filtro opcional por tipo)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  const characters = await prisma.character.findMany({
    where: type ? { type } : undefined,
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json(characters)
}

// POST - Crear personaje
export async function POST(request: Request) {
  const body = await request.json()
  const { name, type, health, attack, defense, speed } = body

  const character = await prisma.character.create({
    data: { name, type, health, attack, defense, speed }
  })

  return NextResponse.json(character, { status: 201 })
}