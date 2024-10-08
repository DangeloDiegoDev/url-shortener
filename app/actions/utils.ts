'use server'
import { cookies, headers } from "next/headers";
import { verifyToken } from "./auth";
import prisma from "@/prisma/db";
import { EncryptJWT } from 'jose';

export async function getIp() {
    return headers().get('x-forwarded-for')!;
}

export async function shortenLink(link: string) {
    const email = await verifyToken();

    if (!email) {
        return { error: 'Logueate primero' }
    }
    if (link === "") {
        return { error: 'Escribí un link primero' }
    }
    if (!link.includes(".")) {
        return { error: 'Link malformado' }
    }

    const currentDate = Number(new Date());
    const lastShortDate = await getLastShortDate(email) as number;
    const timeDiff = (currentDate - lastShortDate) / 60000;
    const firstTime = await isFirstTime(email);

    if (!firstTime && timeDiff < 1 && timeDiff > 0) {
        return { error: 'No podés tan rápido esperá 1 minuto' }
    }

    let uuid = Math.random().toString(36).slice(-7);

    let duplicatedUuid = await prisma.links.findFirst({
        where: {
            shortened: uuid
        }
    })

    while (duplicatedUuid !== null) {
        uuid = Math.random().toString(36).slice(-7);
        duplicatedUuid = await prisma.links.findFirst({
            where: {
                shortened: uuid
            }
        })
    }

    await prisma.user.update({
        where: {
            email: email
        },
        data: {
            lastShortDate: new Date(),
            firstTime: false,
            links: {
                create: {
                    original: link,
                    shortened: uuid
                }
            }
        }
    })

    return { message: uuid }
}

export async function getLastShortDate(email: string) {
    const lastShortDate = await prisma.user.findFirst({
        select: {
            lastShortDate: true
        },
        where: {
            email
        }
    })
    return Number(lastShortDate!.lastShortDate)
}

async function isFirstTime(email: string) {
    const isFirstTime = await prisma.user.findFirst({
        select: {
            firstTime: true
        },
        where: {
            email
        }
    })
    return isFirstTime!.firstTime
}

export async function generateJweToken(email: string) {
    // secret base64 to bytes
    const secret = Uint8Array.from(atob(`${process.env.AUTH_SECRET}`), (c) => c.charCodeAt(0));
    const maxAge = 7 * 24 * 60 * 60;

    const token = await new EncryptJWT({ email })
        .setProtectedHeader({ alg: 'dir', enc: 'A256CBC-HS512' })
        .setIssuedAt()
        .setExpirationTime('7 days')
        .encrypt(secret)

    cookies().set("session", token, { httpOnly: true, secure: true, maxAge })

    return token;
}