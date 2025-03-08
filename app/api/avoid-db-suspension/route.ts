export const dynamic = 'force-dynamic';
import prisma from "@/prisma/db";

export async function GET(request: Request) {
    if (request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response("Unauthorized", { status: 401 });
    };

    await prisma.$connect();

    const fetchedUser = await prisma.user.findFirstOrThrow({
        select: { id: true }
    });

    return Response.json(fetchedUser);
}