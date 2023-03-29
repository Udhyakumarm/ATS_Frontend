import Image from "next/image";
import userImg from '/public/images/user-image.png';

export default function UploadProfile({note} : any) {
    return(
        <>
        <label htmlFor="uploadProfile" className={'inline-block relative cursor-pointer rounded-full mb-2'}>
            <Image src={userImg} alt='User' width={300} className="rounded-full object-cover w-[100px] h-[100px] shadow-highlight" />
            <span className="bg-white dark:bg-gray-500 text-darkGray dark:text-white absolute right-[0px] bottom-[0px] w-6 h-6 leading-6 shadow-highlight text-center rounded-full text-[12px]">
                <i className="fa-solid fa-plus"></i>
            </span>
            <input type="file" id="uploadProfile" hidden />
        </label>
        <p className="italic text-darkGray dark:text-gray-400 text-sm">{note}</p>
        </>
    )
}