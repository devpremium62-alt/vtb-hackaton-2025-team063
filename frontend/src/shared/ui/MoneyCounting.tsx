'use client';
import {motion, useMotionValue, useTransform, animate} from 'framer-motion';
import {useEffect} from 'react';

type Props = {
    value: number;
}

const BalanceCounter = ({ value }: Props) => {
    const balance = useMotionValue(0);
    const rounded = useTransform(balance, (latest) =>
        Math.floor(latest).toLocaleString('ru-RU')
    );

    useEffect(() => {
        const controls = animate(balance, value, {
            duration: 0.6,
            ease: 'easeOut',
        });
        return () => controls.stop();
    }, [value]);

    return (
        <motion.div
            transition={{ duration: 0.4 }}
            className="text-3xl xxs:text-4xl font-bold text-white"
        >
            <motion.span>{rounded || '0'}</motion.span> ₽
        </motion.div>
    );
};

export default BalanceCounter;