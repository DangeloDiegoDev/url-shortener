'use server'
import prisma from "@/prisma/db";
import { verifyToken } from "./auth";
import { z } from 'zod';

export async function getUserLinks() {
    const email = await verifyToken();
    if (email) {
        const userLinks = await prisma.user.findMany({
            where: {
                email: email
            },
            select: {
                links: true
            }
        })
        return userLinks[0].links.length === 0 ? 'No tenés links guardados' : userLinks[0].links
    } else {
        return 'No token'
    }
}

export async function updateUserLink(linkId: number, authorId: number, shortLink: string, destination: string) {
    const shortLinkSchema = z.string().min(1).max(7);
    const destinationSchema = z.string().min(1).includes(".");

    const shortLinkResult = await shortLinkSchema.safeParseAsync(shortLink);
    const destinationResult = await destinationSchema.safeParseAsync(destination);

    if (!shortLinkResult.success || !destinationResult.success) {
        const errors = Object.fromEntries(
            [['shortLink', shortLinkResult.error?.issues[0].message], ['destination', destinationResult.error?.issues[0].message]]
        )
        return errors;
    }

    await prisma.user.update({
        where: {
            id: authorId
        },
        data: {
            links: {
                update: {
                    where: {
                        id: linkId
                    },
                    data: {
                        original: destination,
                        shortened: shortLink
                    }
                }
            }
        }
    })
}

export async function deleteUserLink(authorId: number, linkId: number) {
    await prisma.user.update({
        where: {
            id: authorId
        },
        data: {
            links: {
                delete: {
                    id: linkId
                }
            }
        }
    })
}