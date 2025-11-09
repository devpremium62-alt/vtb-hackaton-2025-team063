"use client";

import {motion} from "framer-motion";
import {useMemo} from "react";
import useShowingSkeleton from "@/shared/hooks/useShowingSkeleton";
import {useDroppable} from "@dnd-kit/core";

type Col = { id:number; color: string; value: number };

type ColProps = {
    index: number;
    maxValue: number;
    col: Col;
}


const HistogramColumn = ({index, maxValue, col}: ColProps) => {
    const {isOver, setNodeRef} = useDroppable({
        id: `droppable-col-${index}`,
        data: {id: col.id}
    })

    const style = {
        backgroundColor: isOver ? "var(--primary-color)" : col.color
    };

    const height = Math.round((col.value / maxValue) * 100);

    return <motion.div
        ref={setNodeRef}
        className="w-8 rounded-lg transition-colors duration-500"
        style={{...style}}
        initial={{height: 0}}
        animate={{height: `${Math.max(5, height)}%`}}
        transition={{
            type: "spring",
            stiffness: 120,
            damping: 20,
            delay: index * 0.05,
        }}
    />
}

type Props = {
    data: Col[];
}

const Histogram = ({data}: Props) => {
    const maxValue = useMemo(() => {
        return data.reduce((acc, c) => Math.max(acc, c.value), 0);
    }, [data]);

    const showingSkeleton = useShowingSkeleton(data);
    if (showingSkeleton) {
        return <div className="rounded-xl bg-tertiary animate-pulse h-52"></div>;
    }

    return <div className="flex justify-center items-end gap-3.5 h-52">
        {data.map((col, i) => {
            return <HistogramColumn key={i} index={i} maxValue={maxValue} col={col}/>
        })}
    </div>;
}

export default Histogram;