import Link from 'next/link'
import Image from 'next/image';

export default function NotFound() {
    return (
        <div className='flex flex-col justify-center items-center h-screen bg-slate-950'>
            <div className='text-white flex flex-col items-center justify-center p-32 rounded-md gap-6 border-2 border-red-500'>
                <div className='flex items-center gap-4'>
                    <Image src='/not-found.svg' alt='Not found icon' width={40} height={40}></Image>
                    <h2>Not Found</h2>
                </div>
                <p>Link is incorrect or doesn{`'`}t exist</p>
                <Link href="/" className='ring-2 ring-red-500 p-2 rounded-md hover:bg-slate-900'>Return Home</Link>
            </div>
        </div>
    )
}