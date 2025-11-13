"use client";

import Image from "next/image";
import VariantPick from "@/shared/ui/inputs/VariantPick";

const icons = ["money", "fix", "car", "gift", "vacation", "target"];

type Props = {
    id?: string
    icon?: string;
    onIconChange(icon: string): void;
}

const IconPick = ({icon, onIconChange, ...props}: Props) => {
    return <VariantPick variant={icon} variants={icons} onVariantChange={onIconChange} element={(icon) => {
        return <Image width={36} height={36} className="w-9 h-9 p-2" src={`/images/categories/${icon}.png`} alt="" sizes="36px"/>
    }} {...props}/>
}

export default IconPick;