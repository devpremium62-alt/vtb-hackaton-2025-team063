import Image, {StaticImageData} from "next/image";

type Props = {
    alt?: string;
    avatar: string | StaticImageData;
    className?: string;
}

const Avatar = ({avatar, className = "", alt = ""}: Props) => {
    if(!avatar) {
        return null;
    }

    return <div className={`w-[2.375rem] h-[2.375rem] relative ${className}`}>
        <Image className="rounded-full" fill src={avatar} alt={alt} sizes="38px"/>
    </div>
}

export default Avatar;