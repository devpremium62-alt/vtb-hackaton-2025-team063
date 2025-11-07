"use client";

import Heading from "@/shared/ui/typography/Heading";
import ProgressBar from "@/shared/ui/ProgressBar";
import MoneyAmount from "@/shared/ui/MoneyAmount";
import {motion} from "framer-motion";
import Avatar from "@/shared/ui/Avatar";
import AccentButton from "@/shared/ui/AccentButton";

type Props = {
    moneyCollected: number;
    moneyPerDay: number;
    avatar: string;
}

const ChildAccount = ({moneyCollected, moneyPerDay, avatar}: Props) => {
    return <section className="mx-4 md:ml-0 mb-[1.875rem]">
        <div className="mb-2.5">
            <Heading level={2}>Детский счет</Heading>
        </div>
        <div className="bg-primary text-white rounded-xl py-2 px-1.5">
            <motion.div initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -10}}
                        transition={{duration: 0.3}}>
                <div className="flex items-baseline justify-between mb-5">
                    <p className="text-3xl xxs:text-[2.5rem] mb-0.5 leading-none font-bold"><MoneyAmount value={moneyCollected}/></p>
                    <Avatar avatar={avatar} alt="Ребенок"/>
                </div>
                <div className="flex items-center justify-between gap-5">
                    <div className="flex-1">
                        <p className="font-medium text-xs mb-0.5">
                            <MoneyAmount value={moneyPerDay}/> в день
                        </p>
                        <div className="flex-1">
                            <ProgressBar indicators value={moneyCollected} max={moneyPerDay * 30}/>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button className="bg-primary-dark text-white text-sm font-medium px-3 py-1 rounded-2xl cursor-pointer flex items-center bg-primary-dark">
                            Изменить лимит
                        </button>
                        <AccentButton>Пополнить</AccentButton>
                    </div>
                </div>
            </motion.div>
        </div>
    </section>
}

export default ChildAccount;