export const dynamic = 'force-dynamic';
import prisma from "@/prisma/db";

export async function GET(request: Request) {
    if (request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response("Unauthorized", { status: 401 });
    };

    await prisma.$connect();

    const allUsers = await prisma.user.findMany({
        select: {
            lastShortDate: true,
            id: true
        }
    });

    const filteredUsers = allUsers.filter((e) =>
        (Number(new Date()) - Number(e.lastShortDate)) / 8.64e+7 > 30
    );

    filteredUsers.forEach(async (e) => {
        if (filteredUsers.length > 0) {
            await prisma.links.deleteMany({
                where: {
                    authorId: e.id
                }
            })
            await prisma.user.delete({
                where: {
                    id: e.id
                }
            })
        }
    });

    return new Response("Old users deleted!");
}