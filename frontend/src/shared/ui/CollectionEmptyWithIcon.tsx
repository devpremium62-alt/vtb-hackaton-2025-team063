import {Cancel} from "@/shared/ui/icons/Cancel";
import CollectionEmpty from "@/shared/ui/CollectionEmpty";
import React from "react";

type Props = {
    className?: string;
    children?: React.ReactNode;
}

const CollectionEmptyWithIcon = ({className, children}: Props) => {
    return <CollectionEmpty className={`flex flex-col items-center ${className}`}>
        <Cancel className="w-10 h-10 mb-1"/>
        {children}
    </CollectionEmpty>;
}

export default CollectionEmptyWithIcon;