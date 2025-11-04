'use client';

import { motion } from "framer-motion";

type Props = {
    value: number;
    max: number;
    indicators?: boolean;
}

const ProgressBar = ({value, max, indicators = false}: Props) => {
    const percent = Math.min((value / max) * 100, 100);
    let bgColor = "bg-accent";

    if(indicators) {
        if(percent >= 100) {
            bgColor = "bg-error";
        } else if(percent >= 80) {
            bgColor = "bg-warning";
        }
    }

    return <div className="h-1 w-full bg-accent-transparent rounded-2xl">
        <motion.div
            initial={{width: 0}}
            animate={{width: `${percent}%`}}
            transition={{duration: 0.6, ease: 'easeOut'}}
            className={`${bgColor} h-1 rounded-2xl`}
        />
    </div>;
}

export default ProgressBar;