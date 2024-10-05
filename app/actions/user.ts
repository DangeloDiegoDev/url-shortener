'use server'
import { verifyToken } from "./auth";
import { getIp } from "./utils";
import prisma from "@/prisma/db";

export async function upsertUser(name: string, email: string, avatar?: string, nickname?: string, password?: string) {
    const userIp = await getIp();
    await prisma.user.upsert({
        create: {
            ip: userIp,
            name: name,
            email: email,
            avatar: avatar,
            nickname: nickname || (Math.random() * 1e32).toString(36).slice(-16),
            password: password
        },
        where: {
            email: email
        },
        update: {
            avatar: avatar
        }
    })
}

export async function getUserData() {
    const email = await verifyToken();

    if (email) {
        const userData = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        return userData;
    }
}