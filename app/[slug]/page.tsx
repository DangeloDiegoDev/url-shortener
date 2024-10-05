import { notFound, redirect } from 'next/navigation';
import prisma from "@/prisma/db";

export default async function Slug({ params }: { params: { slug: string } }) {
    const shortenedLink = await prisma.links.findFirst({
        where: {
            shortened: params.slug
        }
    })

    if (shortenedLink) {
        if (shortenedLink.original.startsWith('http://') || shortenedLink.original.startsWith('https://')) {
            return redirect(shortenedLink!.original);
        } else {
            return redirect(`https://${shortenedLink!.original}`);
        }
    } else {
        notFound()
    }
}