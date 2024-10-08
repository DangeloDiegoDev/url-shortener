import { auth } from "@/app/auth";
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Hamburger from "./Hamburger";

export default async function Header() {
    const credentialsToken = cookies().get('session')?.value;
    const oauthSession = await auth();

    const clearSession = async () => {
        'use server'
        cookies().delete("session")
        redirect("/")
    }

    return (
        <section className="h-full flex bg-slate-950 text-white">
            <Link href={"/"} className="flex flex-grow items-center gap-4 pl-4">
                <Image src="/scissors.svg" alt="Website logo" width={40} height={40}></Image>
                <h1>URL SHORTENER</h1>
            </Link>
            {(credentialsToken || oauthSession) && <div className="flex items-center my-4 mr-4 border-2 border-red-500 rounded-md hover:bg-slate-900 max-sm:hidden">
                <Link className="px-4" href={"/profile"}>Profile</Link>
            </div>}
            <div className="flex items-center my-4 mr-4 border-2 border-red-500 rounded-md hover:bg-slate-900 max-sm:hidden">
                {!credentialsToken && !oauthSession && <Link className="px-4" href={'/api/auth/signin'}>Log in</Link>}
                {!credentialsToken && oauthSession && <Link className="px-4" href={'/api/auth/signout'}>Log out</Link>}
                {credentialsToken && !oauthSession && <form className="px-4" action={clearSession}>
                    <button type="submit">Log out</button>
                </form>}
            </div>
            <Hamburger credentialsToken={credentialsToken} oauthSession={oauthSession} clearSession={clearSession} />
        </section>
    )
}