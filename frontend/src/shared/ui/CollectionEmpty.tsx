"use client";

import {motion} from "framer-motion";

const CollectionEmpty = ({children}: any) => {
    return <motion.p className="text-center font-medium text-lg"
                     initial={{opacity: 0, y: 10}}
                     animate={{opacity: 1, y: 0}}
                     exit={{opacity: 0, y: 10}}
                     transition={{duration: 0.3}}>{children}</motion.p>;
}

export default CollectionEmpty;