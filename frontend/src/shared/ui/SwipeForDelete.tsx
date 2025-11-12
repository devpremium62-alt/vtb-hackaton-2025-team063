"use client";

import {motion, useAnimation, useMotionValue} from "framer-motion";
import {ReactNode, useState} from "react";
import {Delete} from "@/shared/ui/icons/Delete";

type Props = {
    canSwipe?: boolean;
    onDelete: () => void;
    children: ReactNode;
    direction?: "x" | "y";
}

const SwipeForDelete = ({onDelete, children, direction = "x", canSwipe = true}: Props) => {
    const [open, setOpen] = useState(false);
    const swipeVal = useMotionValue(0);
    const controls = useAnimation();

    const handleDragEnd = async (_: any, info: any) => {
        if (info.offset[direction] < -40) {
            setOpen(true);
        } else {
            setOpen(false);
            await swipeBack();
        }
    };

    async function handleDelete() {
        setOpen(false);
        await swipeBack();
        onDelete();
    }

    async function swipeBack() {
        await controls.start({...(direction === "x" ? {x: 0} : {y: 0}), transition: {duration: 0.25}});
    }

    return <>
        <motion.button
            className={`absolute cursor-pointer ${direction === "x" ? "right-0 top-0 w-[40px]" : "bottom-0 w-full h-[40px]"} bottom-0 rounded-xl bg-error flex items-center justify-center text-white ${open ? "pointer-events-auto" : "pointer-events-none"}`}
            initial={{opacity: 0}}
            animate={{opacity: open ? 1 : 0}}
            transition={{duration: 0.25}}
            onClick={handleDelete}
        >
            <Delete className="pointer-events-none"/>
        </motion.button>

        <motion.article
            drag={canSwipe ? direction : false}
            dragConstraints={direction === "x"
                ? {left: -45, right: 0}
                : {top: -45, bottom: 0}}
            style={{[direction]: swipeVal}}
            onDragEnd={handleDragEnd}
            animate={controls}
            transition={{type: "spring", stiffness: 300, damping: 30}}
        >
            {children}
        </motion.article>
    </>
}

export default SwipeForDelete;