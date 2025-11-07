"use client";

import {ReactNode, useState} from "react";
import Image from "next/image";

const icons = ["money", "fix", "car", "gift", "vacation", "target"];

type Props = {
    id?: string;
    fullSize?: boolean;
    onVariantChange(variant: string): void;
    variants: string[];
    element: (value: string) => ReactNode;
}

const VariantPick = ({onVariantChange, variants, fullSize, element, ...props}: Props) => {
    const [selected, setSelected] = useState(0);

    function changeVariant(i: number) {
        setSelected(i);
        onVariantChange(variants[i]);
    }

    return <ul className="flex flex-wrap items-center gap-1 list-none" {...props}>
        {variants.map((variant, i) => (
            <li className={fullSize ? "flex-1" : ""} key={variant}>
                <button type="button" onClick={() => changeVariant(i)}
                        className={`relative rounded-xl transition-colors duration-300 w-full ${i === selected ? "text-white bg-primary" : "bg-nav text-inactive"}`}>
                    {element(variant)}
                </button>
            </li>
        ))}
    </ul>
}

export default VariantPick;