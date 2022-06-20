import { updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { auth, storage } from "../firebase";

interface ProfilePicProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: number,
    clickable?: boolean,
    username?:string,
    url?:string,
    self?:boolean,
}


export default function ProfilePic({ size = 150, clickable, className, username, url, self=true }: ProfilePicProps) {

    const randomId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const [imgURL, setImageURL] = useState<string | null>(null)
    useEffect(() => {
        (!url && self) && auth.currentUser?.photoURL && auth.currentUser?.photoURL && setImageURL(auth.currentUser.photoURL);
        (url && !self) && setImageURL(url);
    }, [])

    const handleChangeFoto = async (e: any) => {

        if (e.target.files.length == 0) return;
        const profilePicsRef = ref(storage, `profilePics/${auth.currentUser?.uid}-profile-pic.jpg`)

        await uploadBytes(profilePicsRef, e.target.files[0]);
        const photoURL = await getDownloadURL(profilePicsRef);

        await updateProfile(auth.currentUser!, { photoURL });
        setImageURL(auth.currentUser!.photoURL!);

    }

    return (
        <>
        <label htmlFor={randomId} className="inline-block">
        <div
            className={`transform transition-all ease-in-out duration-200 rounded-full border-2 bg-blue-light border-transparent ${clickable && "cursor-pointer hover:scale-105 hover:border-blue-mid"} ${className} `}
            style={{
                width: size,
                height: size,
                backgroundImage: imgURL? `url(${imgURL})` : "",
                backgroundSize: "cover",
            }}
            >
                {(!imgURL && !username) && <div className="flex justify-center items-center h-full font-bold text-4xl text-black" style={{fontSize: (size / 2) , transform:`translateY(-${size/30}px)`}}>{auth.currentUser?.displayName?.charAt(0) + "" + auth.currentUser?.displayName?.slice(-1)}</div>}
                {(!imgURL && username) && <div className="flex justify-center items-center h-full font-bold text-4xl">{username.charAt(0) + "" + username.slice(-1)}</div>}
            </div>
            
        </label>
        {clickable && <input type="file" id={randomId} className="hidden opacity-100" onChange={e => handleChangeFoto(e)}/>}
        </>
    )
}
