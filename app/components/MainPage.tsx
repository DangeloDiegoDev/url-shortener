import Image from 'next/image';
import Shortener from './Shortener';
import { getUserData } from '../actions/user';

export default async function MainPage() {
    const userData = await getUserData();

    return (
        <div className="bg-slate-950 text-white h-full flex flex-col items-center justify-center">
            <div className="w-3/4 h-3/4 rounded-md border-2 border-red-500 flex flex-col py-4">
                <div className="flex items-center justify-center gap-4 h-1/4 px-5 text-center">
                    <Image src={userData ? userData.avatar : "/avatar.svg"} alt='Avatar' width={50} height={50} className='border-2 rounded-full'></Image>
                    {userData ? <h1>Welcome {userData.name}</h1> : <h1>Welcome, log in to use</h1>}
                </div>
                <div className="h-3/4">
                    <Shortener />
                </div>
            </div>
            <div className="w-3/4 p-2 rounded-t-none rounded-md cursor-default text-center text-sm">
                <p>Inactive users are deleted every start of month.</p>
                <p>Inactive = last shortened link {'>'} 30 days</p>
            </div>
        </div>
    )
}