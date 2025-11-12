"use client";

import {motion} from "framer-motion";
import AccentButton from "@/shared/ui/AccentButton";
import {Plus} from "@/shared/ui/icons/Plus";

type Props = {
    onClick: () => void;
}

export const ChildAccountCreateDummy = ({onClick}: Props) => {
    return <article onClick={onClick}
                    className="cursor-pointer min-h-28 bg-tertiary rounded-xl py-2 px-1.5 flex items-center justify-center h-full">
        <motion.div initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -10}}
                    transition={{duration: 0.3}}>
            <AccentButton className="w-10 h-10 rounded-full flex justify-center items-center"
                          aria-label="Создать детский счет">
                <Plus className="w-5 h-5"/>
            </AccentButton>
        </motion.div>
    </article>
}
