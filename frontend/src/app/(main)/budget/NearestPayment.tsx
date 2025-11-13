"use client";

import {PaymentType} from "@/entities/payment";
import MoneyAmount from "@/shared/ui/MoneyAmount";
import Heading from "@/shared/ui/typography/Heading";
import { motion } from "framer-motion";
import AccentButton from "@/shared/ui/AccentButton";

type Props = {
    payment: PaymentType;
    onDepositClick: (payment: PaymentType) => void;
}

const NearestPayment = ({payment, onDepositClick}: Props) => {
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
                    <Heading level={3} className="text-white mb-1">
                    <span className="font-medium">
                        <MoneyAmount value={payment.value}/>
                    </span>
                    </Heading>
                </div>
                <AccentButton onClick={() => onDepositClick(payment)}
                              className="text-sm font-medium bg-accent cursor-pointer text-white rounded-2xl py-0.5! px-2.5!">
                    Внести
                </AccentButton>
            </div>
        </motion.div>
    </div>
}

export default NearestPayment;