'use client'
import axios from "axios";
import { FormEvent, useRef, useState } from "react";
import { useRouter } from 'next/navigation'

export default function Login() {
    const nicknameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState(null);
    const router = useRouter();

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (nicknameRef.current && passwordRef.current) {
            const formData = {
                nickname: nicknameRef.current.value,
                password: passwordRef.current.value
            }
            await axios.post("/api/auth/login", formData).then((res) => {
                res.data.error ? setError(res.data.error) : (
                    router.push("/"), router.refresh()
                )
            })
        }
    }

    return (
        <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-4">
            <label htmlFor="nickname" className="hover:text-red-500 cursor-pointer">Nickname</label>
            <input id="nickname" name="nickname" ref={nicknameRef} type="text" className="p-1 outline-none focus:ring-2 focus:ring-red-500 rounded-sm text-black" />
            {error && <p>{error}</p>}
            <label htmlFor="password" className="hover:text-red-500 cursor-pointer">Password</label>
            <input id="password" name="password" ref={passwordRef} type="password" className="p-1 outline-none focus:ring-2 focus:ring-red-500 rounded-sm text-black" />
            <button type="submit" className="hover:text-red-500">Sign in</button>
        </form>
    )
}