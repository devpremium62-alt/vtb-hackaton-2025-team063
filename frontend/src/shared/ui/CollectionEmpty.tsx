"use client";

import {motion} from "framer-motion";

type Props = {
    className?: string;
    children?: any;
}

const CollectionEmpty = ({children, className}: Props) => {
    return <motion.p className={`text-center font-medium text-sm text-secondary py-3 ${className}`}
                     initial={{opacity: 0, y: 10}}
                     animate={{opacity: 1, y: 0}}
                     exit={{opacity: 0, y: 10}}
                     transition={{duration: 0.3}}>{children}</motion.p>;
}

export default CollectionEmpty;