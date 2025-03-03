export const dynamic = 'force-dynamic';
import prisma from "@/prisma/db";

export async function GET() {
    await prisma.$connect();

    const fetchedUser = await prisma.user.findFirstOrThrow({
      select: { id: true }
    });

    return Response.json(fetchedUser);
}