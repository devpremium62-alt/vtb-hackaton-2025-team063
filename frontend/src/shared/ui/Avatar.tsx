import Image, {StaticImageData} from "next/image";

type Props = {
    alt?: string;
    avatar: string | StaticImageData;
    className?: string;
}

const Avatar = ({avatar, className = "", alt = ""}: Props) => {
    return <div className={`w-[2.375rem] h-[2.375rem] relative ${className}`}>
        <Image className="rounded-xl" fill src={avatar} alt={alt} sizes="38px"/>
    </div>
}

export default Avatar;