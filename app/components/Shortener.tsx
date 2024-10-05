'use client'
import { useState } from "react"
import { shortenLink } from "../actions/utils";

export default function Shortener() {
    const [userLink, setUserLink] = useState<string>("");
    const [shortingResponse, setShortingResponse] = useState<string>("");
    const [error, setError] = useState<boolean>(false);

    async function handleShort() {
        const response = await shortenLink(userLink);
        if (response.error) {
            setShortingResponse(response.error)
            setError(true)
        } else {
            setShortingResponse(`Your short link is ${process.env.NEXT_PUBLIC_URL}/${response.message}`)
            setError(false)
        }
    }

    return (
        <div className="flex flex-col justify-center items-center h-full gap-8">
            <label htmlFor="userInput" className="cursor-pointer">
                Paste your link below ↓
            </label>
            <input id="userInput" className="p-4 cursor-pointer rounded-md outline-none ring-2 ring-red-500 focus:ring-white bg-slate-950 hover:bg-slate-900" onChange={(e) => setUserLink(e.target.value)} />
            <button className="ring-2 ring-red-500 rounded-md px-4 py-1 hover:bg-slate-900" onClick={handleShort}>Shorten!</button>
            <div className={`text-black p-2 h-10 mb-2 ${shortingResponse ? 'opacity-100' : 'opacity-0'} ${error ? 'text-red-500' : 'text-green-400'}`}>
                <p>{shortingResponse}</p>
            </div>
        </div>
    )
}