"use client";

import {motion} from "framer-motion";
import React, {useEffect, useMemo, useState} from "react";
import useShowingSkeleton from "@/shared/hooks/useShowingSkeleton";
import {useDroppable} from "@dnd-kit/core";
import InfoPopup from "@/shared/ui/popups/InfoPopup";

type Col = {
    id: number;
    color: string;
    value: number;
    name: string;
};

type ColProps = {
    index: number;
    maxValue: number;
    col: Col;
    onDrag: (col: Col) => void;
}

const HistogramColumn = ({index, maxValue, col, onDrag}: ColProps) => {
    const {isOver, setNodeRef} = useDroppable({
        id: `droppable-col-${index}`,
        data: {id: col.id}
    });

    useEffect(() => {
        if (isOver) {
            onDrag(col);
        }
    }, [isOver]);

    const style = {
        backgroundColor: isOver ? "var(--primary-color)" : col.color
    };

    const height = isOver ? 50 : Math.round((col.value / maxValue) * 100);

    return <div ref={setNodeRef} className="h-full flex items-end">
        <motion.div
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
    </div>
}

type Props = {
    data: Col[];
}

const Histogram = ({data}: Props) => {
    const [isPopupActive, setPopupActive] = useState(false);
    const [dragCol, setDragCol] = useState<Col | null>(null);

    const maxValue = useMemo(() => {
        return data.reduce((acc, c) => Math.max(acc, c.value), 0);
    }, [data]);

    const showingSkeleton = useShowingSkeleton(data);
    if (showingSkeleton) {
        return <div className="rounded-xl bg-tertiary md:bg-blue-100/75! animate-pulse h-52"></div>;
    }

    function onDrag(col: Col) {
        setDragCol(col);
        setPopupActive(true);
    }

    return <div className="flex justify-center items-end gap-3.5 h-52 relative">
        {data.map((col, i) => {
            return <HistogramColumn key={i} index={i} maxValue={maxValue} col={col} onDrag={onDrag}/>
        })}

        <InfoPopup icon={() => <></>} text={dragCol?.name || ""} time={2000}
                   isActive={isPopupActive} setActive={setPopupActive}/>
    </div>;
}

export default Histogram;