"use client";

import Heading from "@/shared/ui/typography/Heading";
import ProgressBar from "@/shared/ui/ProgressBar";
import MoneyAmount from "@/shared/ui/MoneyAmount";
import {motion} from "framer-motion";
import Avatar from "@/shared/ui/Avatar";
import AccentButton from "@/shared/ui/AccentButton";
import {useState} from "react";
import {DepositChildAccount} from "@/widgets/deposit-child-account";

type Props = {
    moneyCollected: number;
    moneyPerDay: number;
    avatar: string;
}

const ShortChildAccount = ({moneyCollected, moneyPerDay, avatar}: Props) => {
    const [isModalActive, setModalActive] = useState(false);

    return <section className="mx-4 md:ml-0 mb-20">
        <Heading level={2}>Детский счет</Heading>
        <div className="bg-tertiary rounded-xl py-2 px-1.5">
            <motion.div initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -10}}
                        transition={{duration: 0.3}}>
                <div className="flex items-start justify-between mb-5">
                    <p className="text-3xl mb-0.5 leading-none font-bold"><MoneyAmount value={moneyCollected}/></p>
                    <Avatar avatar={avatar} alt="Ребенок"/>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-light font-medium text-xs mb-0.5">
                            <MoneyAmount value={moneyPerDay}/> в день
                        </p>
                        <div className="w-2/3">
                            <ProgressBar indicators value={moneyCollected} max={moneyPerDay * 30}/>
                        </div>
                    </div>
                    <div>
                        <AccentButton onClick={() => setModalActive(true)}>Пополнить</AccentButton>
                    </div>
                </div>
            </motion.div>
        </div>
        <DepositChildAccount isActive={isModalActive} setActive={setModalActive}/>
    </section>
}

export default ShortChildAccount;