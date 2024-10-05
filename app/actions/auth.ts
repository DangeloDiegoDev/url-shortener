'use server'
import { cookies } from "next/headers";
import { auth, signIn } from "../auth";
import { jwtDecrypt } from "jose";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

export async function verifyToken() {
    const credentialsToken = cookies().get('session')?.value;
    const oauthSession = await auth();
    const secret = Uint8Array.from(atob(`${process.env.AUTH_SECRET}`), (c) => c.charCodeAt(0));
    if (!credentialsToken && !oauthSession) return null;
    if (credentialsToken) {
        try {
            const { payload } = await jwtDecrypt(credentialsToken, secret);
            return payload.email as string
        } catch (error) {
            // Token error
            console.log(error)
        }
    }
    if (oauthSession) {
        return oauthSession.user!.email
    }
}

export async function handleFormSubmit(providerId: string) {
    try {
        await signIn(providerId, { redirectTo: "/" })
    } catch (error) {
        if (error instanceof AuthError) {
            return redirect(`error?error=${error.type}`)
        }
        throw error
    }
}