'use client'
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

interface HamburgerProps {
    credentialsToken: string | undefined;
    oauthSession: Session | null;
    clearSession: () => Promise<never>;
}

const Hamburger: React.FC<HamburgerProps> = ({credentialsToken, oauthSession, clearSession}) => {
    const burgerRef = useRef<HTMLDivElement>(null);

    function toggleBurger() {
        burgerRef.current?.classList.toggle("hidden")
    }

    return (
        <>
            <button onClick={toggleBurger} className="sm:hidden mr-4">
                <Image src={"/burger.svg"} alt="Open menu" width={35} height={35} />
            </button>
            <section ref={burgerRef} className="sm:hidden hidden bg-transparent text-white absolute top-[10%] w-full h-[calc(100vh-10%)] backdrop-blur-md">
                {(credentialsToken || oauthSession) && <div className="flex items-center m-4 border-2 text-center border-red-500 rounded-md hover:bg-slate-900">
                    <Link className="p-4 w-full" href={"/profile"}>Profile</Link>
                </div>}
                <div className="flex items-center m-4 border-2 text-center border-red-500 rounded-md hover:bg-slate-900">
                    {!credentialsToken && !oauthSession && <Link className="p-4 w-full" href={'/api/auth/signin'}>Log in</Link>}
                    {!credentialsToken && oauthSession && <Link className="p-4 w-full" href={'/api/auth/signout'}>Log out</Link>}
                    {credentialsToken && !oauthSession && <form className="w-full" action={clearSession}>
                        <button type="submit" className="p-4 w-full">Log out</button>
                    </form>}
                </div>
            </section>
        </>
    )
}

export default Hamburger;