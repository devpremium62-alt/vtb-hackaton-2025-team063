import Avatar from "@/shared/ui/Avatar";
import {StaticImageData} from "next/image";

type Props = {
    firstAvatar: string | StaticImageData;
    secondAvatar: string | StaticImageData;
}

const CoupleAvatars = ({firstAvatar, secondAvatar}: Props) => {
    return <div className="flex items-center">
        <Avatar avatar={firstAvatar}/>
        <Avatar className="-ml-2.5" avatar={secondAvatar}/>
    </div>;
}

export default CoupleAvatars;