import { NextResponse } from 'next/server';
import { compare } from 'bcrypt';
import { generateJweToken } from '@/app/actions/utils';
import prisma from "@/prisma/db";

export async function POST(request: Request) {
    const body = await request.json();

    const user = await prisma.user.findUnique({
        where: {
            nickname: body.nickname
        }
    })

    if (!user) return NextResponse.json({ error: "El usuario no existe" })

    const passwordIsValid = await compare(body.password, user.password)

    if (!passwordIsValid) return NextResponse.json({ error: "La contraseña es incorrecta" })

    const token = await generateJweToken(user.email)

    return NextResponse.json(token)
}