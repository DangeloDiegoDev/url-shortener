import { NextResponse } from "next/server";
import { signupSchema } from "@/app/auth";
import { upsertUser } from "@/app/actions/user";
import { generateJweToken } from "@/app/actions/utils";
import bcrypt from "bcrypt";
import prisma from "@/prisma/db";

export async function POST(request: Request) {
    const body = await request.json();
    const result = await signupSchema.safeParseAsync(body);

    if (result.success) {
        let emailExists = await prisma.user.findUnique({
            where: {
                email: result.data.email
            }
        })

        let nicknameExists = await prisma.user.findUnique({
            where: {
                nickname: result.data.nickname
            }
        })

        const errors = []

        if (emailExists) errors.push(["email", "Email already exists"])
        if (nicknameExists) errors.push(["nickname", "Nickname already exists"])
        const serverErrors = Object.fromEntries(errors)
        if (emailExists || nicknameExists) return NextResponse.json({ errors: serverErrors })

        const hashedPassword = await bcrypt.hash(result.data.password, 10);

        await upsertUser(result.data.name, result.data.email, undefined, result.data.nickname, hashedPassword);

        await generateJweToken(result.data.email);
    }

    // If validation errors, map them into an object
    const serverErrors = Object.fromEntries(
        result.error?.issues?.map((issue) => [issue.path[0], issue.message]) || []
    );

    // Respond with a JSON object containing the validation errors
    return NextResponse.json({ errors: serverErrors });
}