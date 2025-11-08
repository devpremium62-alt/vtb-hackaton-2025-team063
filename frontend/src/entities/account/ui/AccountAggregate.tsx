"use client";

import {type PersonalAccountType} from "@/entities/account/model/types";
import Heading from "@/shared/ui/typography/Heading";
import Image from "next/image";
import MoneyAmount from "@/shared/ui/MoneyAmount";
import {motion} from "framer-motion";
import Avatar from "@/shared/ui/Avatar";

type Props = {
    className?: string;
    style?: object;
    account: PersonalAccountType;
}

export const AccountAggregate = ({account, className = "", ...props}: Props) => {
    return <div className={`bg-tertiary rounded-xl px-2 py-1 ${className}`} {...props}>
        <motion.div initial={{opacity: 0, y: 40}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.3, ease: 'easeOut'}}>
            <div className="flex items-center gap-2 mb-2">
                <Avatar avatar={account.avatar} alt={account.name}/>
                <Heading level={3}>{account.name}</Heading>
            </div>
            <div className="text-light">
                <p className="text-[0.6rem]">Баланс</p>
                <p className="text-2xl xxs:text-3xl leading-none font-semibold">
                    <MoneyAmount value={account.balance}/>
                </p>
            </div>
        </motion.div>
    </div>;
}