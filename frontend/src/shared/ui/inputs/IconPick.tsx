"use client";

import {useState} from "react";
import Image from "next/image";

const icons = ["money", "fix", "car", "gift", "vacation", "target"];

type Props = {
    onIconChange(icon: string): void;
}

const IconPick = ({onIconChange, ...props}: any & Props) => {
    const [selected, setSelected] = useState(0);

    function changeIcon(i: number) {
        setSelected(i);
        onIconChange(icons[i]);
    }

    return <ul className="flex flex-wrap items-center gap-1 list-none" {...props}>
        {icons.map((icon, i) => (
            <li key={icon}>
                <button type="button" onClick={() => changeIcon(i)}
                        className={`w-8 h-8 relative rounded-xl transition-colors duration-300 ${i === selected ? "bg-primary" : "bg-nav"}`}>
                    <Image className="p-2" src={`/images/categories/${icon}.png`} alt="" fill sizes="32зч"/>
                </button>
            </li>
        ))}
    </ul>
}

export default IconPick;