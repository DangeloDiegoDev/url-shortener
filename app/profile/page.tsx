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
                <div className="ring-2 ring-red-500 w-10/12 h-5/6 rounded-md flex justify-center items-center">
                    <div className="flex overflow-hidden w-full">
                        <div className="min-w-2/4 w-full h-full flex flex-col items-center float-left ml-16">
                            <div className="w-32 h-32 rounded-full border-2 overflow-clip">
                                <Image src={userData.avatar} alt="Avatar" width={128} height={128}></Image>
                            </div>
                            <div className="w-full h-full flex flex-col items-center mt-8 gap-2">
                                <p>{userData.name}</p>
                                <p>@{userData.nickname}</p>
                                <p>{userData.email}</p>
                            </div>
                        </div>
                        <div className="min-w-2/4 w-full h-full flex flex-col float-right mr-16">
                            <ManageLinks />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}