import { signOut } from "@/app/auth"
import Image from "next/image"
import Link from "next/link"

export default async function SignOutPage() {
    return (
        <div className="bg-slate-950 h-screen flex items-center justify-center">
            <div className="text-white border-2 border-red-500 rounded-md w-2/4 h-4/6 pb-16">
                <div className="flex h-2/4 justify-center items-center text-2xl">
                    <h1 className="text-center">Are you sure you want to sign out?</h1>
                </div>
                <div className="flex h-2/4 justify-center items-start text-xl">
                    <form
                        action={async () => {
                            "use server"
                            await signOut({ redirectTo: "/" })
                        }}
                    >
                        <div className="flex flex-col gap-4">
                            <button type="submit">
                                <div className="flex text-black bg-slate-50 rounded-md items-center gap-2 p-4 hover:bg-slate-200">
                                    <Image src={'/door.svg'} alt="Door icon" width={50} height={50} />
                                    <p>Sign out</p>
                                </div>
                            </button>
                            <div className="flex justify-center items-center gap-4 before:flex-1 after:flex-1 before:bg-slate-50 before:h-[1px] after:bg-slate-50 after:h-[1px]">
                                <span>or</span>
                            </div>
                            <Link href="/" className='text-black bg-slate-50 text-center p-2 rounded-md hover:bg-slate-200'>Return Home</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}