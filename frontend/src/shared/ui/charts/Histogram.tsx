"use client";

import { motion } from "framer-motion";
import {useEffect, useMemo, useState} from "react";
import useShowingSkeleton from "@/shared/hooks/useShowingSkeleton";

type Props = {
    data: { color: string; value: number }[];
}

const Histogram = ({data}: Props) => {
    const maxValue = useMemo(() => {
        return data.reduce((acc, c) => Math.max(acc, c.value), 0);
    }, [data]);

    const showingSkeleton = useShowingSkeleton(data);
    if(showingSkeleton) {
        return <div className="rounded-xl bg-tertiary animate-pulse h-52"></div>;
    }

    return <div className="flex justify-center items-end gap-3.5 h-52">
        {data.map((col, i) => {
            const height = Math.round((col.value / maxValue) * 100);

            return (
                <motion.div
                    key={i}
                    className="w-8 rounded-lg"
                    style={{backgroundColor: col.color}}
                    initial={{height: 0}}
                    animate={{height: `${height}%`}}
                    transition={{
                        type: "spring",
                        stiffness: 120,
                        damping: 20,
                        delay: i * 0.05,
                    }}
                />
            );
        })}
    </div>;
}

export default Histogram;