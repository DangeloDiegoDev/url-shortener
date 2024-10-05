import { signOut } from "@/app/auth"
import Image from "next/image"

export default async function SignOutPage() {
    return (
        <div className="bg-slate-950 h-screen flex items-center justify-center">
            <div className="text-white border-2 border-red-500 rounded-md w-2/4 h-4/6">
                <div className="flex h-2/4 justify-center items-center text-2xl">
                    <h1>Are you sure you want to sign out?</h1>
                </div>
                <div className="flex h-2/4 justify-center items-start text-xl">
                    <form
                        action={async () => {
                            "use server"
                            await signOut({ redirectTo: "/" })
                        }}
                    >
                        <button type="submit">
                            <div className="flex text-black bg-slate-50 rounded-md items-center gap-2 p-4 hover:bg-slate-200">
                                <Image src={'/door.svg'} alt="Door icon" width={50} height={50} />
                                <p>Sign out</p>
                            </div>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}