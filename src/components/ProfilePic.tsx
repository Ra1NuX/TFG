import { updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { auth, storage } from "../firebase";

interface ProfilePicProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: number,
    clickable?: boolean,
}


export default function ProfilePic({ size = 150, clickable, className }: ProfilePicProps) {

    const randomId =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    const [imgURL, setImageURL] = useState<string | null>(null)

    useEffect(() => {
        auth.currentUser?.photoURL && auth.currentUser?.photoURL && setImageURL(auth.currentUser.photoURL);
    }, [])

    const handleChangeFoto = async (e: any) => {

        if (e.target.files.length == 0) return;
        const profilePicsRef = ref(storage, `profilePics/${auth.currentUser?.displayName}-profile-pic.jpg`)

        await uploadBytes(profilePicsRef, e.target.files[0]);
        const photoURL = await getDownloadURL(profilePicsRef);

        await updateProfile(auth.currentUser!, { photoURL });
        setImageURL(auth.currentUser!.photoURL!);

    }

    return (
        <>
        <label htmlFor={randomId} className="flex w-fit">
        <div
            className={`rounded-full border-2 border-transparent ${clickable && "cursor-pointer hover:scale-105 hover:border-violet-600"} ${className} `}
            style={{
                width: size,
                height: size,
                backgroundImage: imgURL? `url(${imgURL})` : "",
                backgroundSize: "cover",
                backgroundColor: "violet",
            }}
            />
            {!imgURL && <div className="flex justify-center items-center font-bold text-violet-700">RN</div>}
        </label>
        {clickable && <input type="file" id={randomId} className="hidden opacity-100" onChange={e => handleChangeFoto(e)}/>}
        </>
    )
}
