'use client'
import { useEffect, useRef, useState } from "react"
import { deleteUserLink, getUserLinks, updateUserLink } from "../actions/links";

export default function ManageLinks() {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const selectedLinkShortLinkRef = useRef<HTMLInputElement>(null);
    const updateBtnRef = useRef<HTMLButtonElement>(null);
    const [userLinks, setUserLinks] = useState<any>([]);
    const [selectedLink, setSelectedLink] = useState<any>({});
    const [selectedLinkShortLink, setSelectedLinkShortLink] = useState<any>(null);
    const [selectedLinkDestination, setSelectedLinkDestination] = useState<any>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        if (!isEditing) {
            handleUserLinks();
        }
        selectedLinkShortLinkRef.current?.focus();
    }, [isEditing])

    useEffect(() => {
        updateBtnRef.current?.disabled && (updateBtnRef.current.style.cursor = "not-allowed");
        updateBtnRef.current?.disabled === false && (updateBtnRef.current.style.cursor = "pointer");
    }, [isEditing, selectedLinkShortLink, selectedLinkDestination])

    async function handleUserLinks() {
        const links = await getUserLinks();
        setUserLinks(links)
    }

    function handleDialogRef(index: number) {
        setSelectedLink(userLinks[index]);
        dialogRef.current!.showModal();
        setSelectedLinkShortLink(userLinks[index].shortened);
        setSelectedLinkDestination(userLinks[index].original)
    }

    function Loading() {
        return <p className="text-center">🌀 Loading...</p>
    }

    function handleEdit() {
        setIsEditing(true);
    }

    function handleCancel() {
        setIsEditing(false);
        dialogRef.current!.close();
    }

    async function handleUpdate() {
        const error = await updateUserLink(selectedLink.id, selectedLink.authorId, selectedLinkShortLink, selectedLinkDestination);
        setError(error);
        if (!error) setIsEditing(false);
    }

    function closeModal(e: React.MouseEvent<HTMLDialogElement>) {
        if (e.target === dialogRef.current) {
            setIsEditing(false);
            dialogRef.current.close();
        }
    }

    async function handleDelete() {
        await deleteUserLink(selectedLink.authorId, selectedLink.id);
        dialogRef.current!.close();
        handleUserLinks();
    }

    return <>
        <div className="overflow-y-auto gap-6">
            {userLinks.length === 0 && <Loading />}
            {typeof (userLinks) === 'string' ? <p className="text-center">{userLinks}</p> :
                userLinks.map((e: any, index: any) => (
                    <div key={index} className="border-2 rounded-md break-all p-2 cursor-pointer hover:bg-gray-900" onClick={() => handleDialogRef(index)}>
                        <span className="text-red-500">Short link: </span><span>{`${process.env.NEXT_PUBLIC_URL}/${e.shortened}`}</span><br></br>
                        <span className="text-red-500">Destination: </span><span>{e.original}</span>
                    </div>
                ))
            }
        </div>
        <dialog ref={dialogRef} onClick={(e) => closeModal(e)} className="bg-transparent backdrop:backdrop-blur-md w-3/4">
            <div className="h-[calc(100vh-calc(100vh*0.25))] text-white rounded-md flex flex-col justify-between">
                <div className="backdrop-blur-md h-5/6 flex flex-col justify-center text-xl gap-8">
                    <div className="self-center w-2/4 text-end">
                        <button onClick={handleCancel} className="border-2 rounded-full w-8 hover:bg-gray-800">X</button>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-4">
                        <label htmlFor="shortLink">
                            <span className="text-red-500 cursor-pointer">Short link</span>
                        </label>
                        {isEditing ? <input id="shortLink" ref={selectedLinkShortLinkRef} onChange={(e) => setSelectedLinkShortLink(e.target.value)} defaultValue={selectedLinkShortLink} className="w-2/4 border-2 rounded-md p-2 bg-transparent outline-none focus:border-red-500 hover:bg-gray-900" /> : <p className="w-2/4 border-2 rounded-md p-2">{selectedLinkShortLink}</p>}
                        {error?.shortLink && <p>{error.shortLink}</p>}
                    </div>
                    <div className="flex flex-col items-center justify-center gap-4">
                        <label htmlFor="destination">
                            <span className="text-red-500 cursor-pointer">Destination</span>
                        </label>
                        {isEditing ? <input id="destination" onChange={(e) => setSelectedLinkDestination(e.target.value)} defaultValue={selectedLinkDestination} className="w-2/4 border-2 rounded-md p-2 bg-transparent outline-none focus:border-red-500 hover:bg-gray-900" /> : <p className="w-2/4 border-2 rounded-md p-2">{selectedLinkDestination}</p>}
                        {error?.destination && <p>{error.destination}</p>}
                    </div>
                </div>
                <div className="backdrop-blur-md h-1/6 flex items-center justify-center">
                    <div className="flex gap-8 text-xl">
                        {!isEditing ? <button onClick={handleEdit} className="hover:text-gray-400">Edit</button> : <>
                            <button ref={updateBtnRef} onClick={handleUpdate} disabled={selectedLinkDestination === selectedLink.original && selectedLinkShortLink === selectedLink.shortened} className="hover:text-gray-400">Update</button>
                            <button onClick={handleCancel} className="hover:text-gray-400">Cancel</button>
                        </>}
                        <button onClick={handleDelete} className="hover:text-gray-400">Delete</button>
                    </div>
                </div>
            </div>
        </dialog>
    </>
}