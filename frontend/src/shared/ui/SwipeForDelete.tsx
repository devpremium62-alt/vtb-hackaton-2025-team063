"use client";

import {motion, useMotionValue} from "framer-motion";
import {ReactNode, useState} from "react";
import {Delete} from "@/shared/ui/icons/Delete";

type Props = {
    onDelete: () => void;
    children: ReactNode;
}

const SwipeForDelete = ({onDelete, children}: Props) => {
    const [open, setOpen] = useState(false);
    const x = useMotionValue(0);

    const handleDragEnd = (_: any, info: any) => {
        if (info.offset.x < -40) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    };

    return <>
        <motion.div
            className="absolute right-0 top-0 bottom-0 rounded-xl w-[40px] bg-error flex items-center justify-center text-white"
            initial={{opacity: 0}}
            animate={{opacity: open ? 1 : 0}}
            transition={{duration: 0.25}}
            onClick={() => onDelete()}
        >
            <Delete/>
        </motion.div>

        <motion.article
            className="bg-tertiary rounded-xl"
            drag="x"
            dragConstraints={{left: -45, right: 0}}
            style={{x}}
            onDragEnd={handleDragEnd}
            animate={{x: open ? -45 : 0}}
            transition={{type: "spring", stiffness: 300, damping: 30}}
        >
            {children}
        </motion.article>
    </>
}

export default SwipeForDelete;