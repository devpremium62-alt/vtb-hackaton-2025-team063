import Image from "next/image";
import {motion} from "framer-motion";

const RegisterHead = ({children}: any) => {
    return <motion.div initial={{opacity: 0}}
                       animate={{opacity: 1}}
                       exit={{opacity: 0}}
                       transition={{duration: 0.3}} className="mb-10 flex flex-col items-center">
        <div className="mb-1">
            <Image width={70} height={51} src="/images/logo.png" alt="Семейный мультибанк"/>
        </div>
        <div className="flex flex-col items-center text-center">
            {children}
        </div>
    </motion.div>
}

export default RegisterHead;