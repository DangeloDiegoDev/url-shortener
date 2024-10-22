import Header from "../components/layout/Header";
import Image from "next/image";
import ManageLinks from "../components/ManageLinks";
import { getUserData } from "../actions/user";

export default async function Profile() {
    const userData: any = await getUserData();

    return (
        <div className="h-screen">
            <div className='h-[10%]'>
                <Header />
            </div>
            <div className="bg-slate-950 h-[90%] text-white flex justify-center items-center">
                <div className="ring-2 ring-red-500 w-10/12 h-5/6 rounded-md flex justify-center items-center overflow-hidden">
                    <div className="flex overflow-hidden w-full h-full max-sm:flex-col max-sm:gap-8">
                        <div className="w-2/4 h-full flex flex-col items-center justify-center sm:pl-16 max-sm:w-full max-sm:mt-8">
                            <div className="w-32 h-32 rounded-full border-2 overflow-clip">
                                <Image src={userData.avatar} alt="Avatar" width={128} height={128}></Image>
                            </div>
                            <div className="w-full flex flex-col items-center sm:mt-8 sm:gap-2 max-sm:mt-3 max-sm:gap-0">
                                <p>{userData.name}</p>
                                <p>@{userData.nickname}</p>
                                <p>{userData.email}</p>
                            </div>
                        </div>
                        <div className="w-2/4 h-full flex flex-col max-sm:w-full overflow-y-auto sm:pr-16 sm:py-8 max-sm:pb-6">
                            <ManageLinks />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}