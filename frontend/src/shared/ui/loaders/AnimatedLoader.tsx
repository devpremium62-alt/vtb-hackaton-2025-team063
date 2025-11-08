import Loader from "@/shared/ui/loaders/Loader";
import {AnimatePresence, motion} from "framer-motion";

type Props = {
    isLoading: boolean;
}

const AnimatedLoader = ({isLoading}: Props) => {
    return <AnimatePresence>
        {isLoading
            && <motion.div className="flex items-center justify-center"
                           exit={{opacity: 0}}
                           transition={{duration: 0.3}}
                           layout>
                <Loader size={1.75}/>
            </motion.div>
        }
    </AnimatePresence>;
}

export default  AnimatedLoader;