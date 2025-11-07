"use client";

import {PaymentType} from "@/entities/payment";
import MoneyAmount from "@/shared/ui/MoneyAmount";
import Heading from "@/shared/ui/typography/Heading";
import { motion } from "framer-motion";

type Props = {
    payment: PaymentType;
}

const NearestPayment = ({payment}: Props) => {
    return <div className="p-2.5 rounded-xl bg-primary mb-2.5">
        <motion.div className="flex items-start justify-between " initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -10}}
                    transition={{duration: 0.3}}>
            <div>
                <p className="text-white font-light text-xs flex items-center gap-1 mb-0.5">
                    Ближайший платеж
                    <time className="text-xs">{payment.date.toLocaleDateString()}</time>
                </p>
                <p className="text-white">{payment.name}</p>
            </div>
            <div className="flex flex-col items-end">
                <div className="-mb-1">
                    <Heading level={3} className="text-white">
                    <span className="font-medium">
                        <MoneyAmount value={payment.money}/>
                    </span>
                    </Heading>
                </div>
                <button className="bg-accent text-white text-[0.5rem] px-2.5 py-0.5 rounded-2xl cursor-pointer">
                    Внести
                </button>
            </div>
        </motion.div>
    </div>
}

export default NearestPayment;