'use client';
import {motion, useMotionValue, useTransform, animate} from 'framer-motion';
import {useEffect} from 'react';
import MoneyAmount from "@/shared/ui/MoneyAmount";

type Props = {
    value: number;
}

const BalanceCounter = ({value}: Props) => {
    const balance = useMotionValue(0);
    const rounded = useTransform(balance, (latest) =>
        Math.floor(latest).toLocaleString('ru-RU')
    );

    useEffect(() => {
        const controls = animate(balance, value, {
            duration: 1,
            ease: 'easeOut',
        });
        return controls.stop;
    }, [balance]);

    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.4}}
            className="text-4xl font-bold text-white"
        >
            <motion.span>{rounded}</motion.span> ₽
        </motion.div>
    );
}

export default BalanceCounter;