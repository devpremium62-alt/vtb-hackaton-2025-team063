'use client';

import { motion } from "framer-motion";

type Props = {
    value: number;
    max: number;
}

const ProgressBar = ({value, max}: Props) => {
    const percent = Math.min((value / max) * 100, 100);

    return <div className="h-1 w-full bg-accent-transparent rounded-2xl">
        <motion.div
            initial={{width: 0}}
            animate={{width: `${percent}%`}}
            transition={{duration: 0.6, ease: 'easeOut'}}
            className="h-1 bg-accent rounded-2xl"
        />
    </div>;
}

export default ProgressBar;