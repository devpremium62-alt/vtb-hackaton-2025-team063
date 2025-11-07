"use client";

import Image from "next/image";
import VariantPick from "@/shared/ui/inputs/VariantPick";

const icons = ["money", "fix", "car", "gift", "vacation", "target"];

type Props = {
    id?: string
    onIconChange(icon: string): void;
}

const IconPick = ({onIconChange, ...props}: Props) => {
    return <VariantPick variants={icons} onVariantChange={onIconChange} element={(icon) => {
        return <Image width={32} height={32} className="w-8 h-8 p-2" src={`/images/categories/${icon}.png`} alt="" sizes="32px"/>
    }} {...props}/>
}

export default IconPick;