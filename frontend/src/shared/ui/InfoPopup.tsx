"use client";

import {useEffect, useRef} from "react";
import {Info} from "@/shared/ui/icons/Info";

type Props = {
    text: string;
    time: number;
    isActive: boolean;
    className?: string;
    setActive: React.Dispatch<React.SetStateAction<boolean>>;
    icon?: () => React.ReactNode;
}


const InfoPopup = ({text, time, isActive, setActive, className = "", icon = () => <Info className="w-4 h-4"/>}: Props) => {
    const timeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isActive) {
            timeout.current = setTimeout(() => {
                setActive(false);
            }, time);
        }

    }, [text, isActive]);

    return <div
        className={`popup absolute top-0 left-1/2 -translate-x-1/2 w-max max-w-full rounded-[1.6875rem] transition-all duration-300 flex items-center gap-1
         p-3.5 px-2.5 text-white ${isActive ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1/2 pointer-events-none"} ${className}`}>
        <p className="text-xs font-normal text-white tracking-wider">{text}</p>
        {icon()}
    </div>
}

export default InfoPopup;