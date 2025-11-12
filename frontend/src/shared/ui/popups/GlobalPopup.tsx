"use client";

import InfoPopup from "@/shared/ui/popups/InfoPopup";
import {ReactNode, useEffect, useState} from "react";

type Props = {
    id?: number;
    text: string;
    background?: string;
    opened?: boolean;
    icon?: () => ReactNode;
}

const GlobalPopup = ({text, icon, background, id, opened}: Props) => {
    const [isActive, setActive] = useState(false);

    useEffect(() => {
        setActive(Boolean(opened));
    }, [text, icon, background, id, opened]);

    return <InfoPopup className="fixed!" text={text} top={0.5} time={3000} isActive={isActive} setActive={setActive} icon={icon} background={background}/>
}

export default GlobalPopup;