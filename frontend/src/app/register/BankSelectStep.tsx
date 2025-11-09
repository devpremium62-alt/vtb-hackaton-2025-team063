"use client";

import {useState} from "react";
import {motion} from "framer-motion";
import {Bank, BankKey, banks} from "@/entities/bank";
import Heading from "@/shared/ui/typography/Heading";
import AccentButton from "@/shared/ui/AccentButton";
import RegisterHead from "@/app/register/RegisterHead";

type Props = {
    onSuccess: (banks: BankKey[]) => void;
}

const BankSelectStep = ({onSuccess}: Props) => {
    const [selectedBanks, setSelectedBanks] = useState<BankKey[]>([]);

    function selectBank(bank: BankKey) {
        if (selectedBanks.includes(bank)) {
            setSelectedBanks(selectedBanks.filter(b => b != bank));
        } else {
            setSelectedBanks([...selectedBanks, bank])
        }
    }

    return <>
        <RegisterHead>
            <h1 className="text-3xl font-semibold leading-none mb-1.5">Выберите банк</h1>
            <p className="max-w-72 font-normal text-secondary leading-tight">Можно добавить до 4-х банков</p>
        </RegisterHead>
        <motion.div
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -10}}
            transition={{duration: 0.3}}>
            <p className="text-right text-xs mb-0.5">{selectedBanks.length} / 4</p>
            <div className="flex flex-col items-stretch gap-2.5 mb-10">
                {(Object.entries(banks) as [BankKey, Bank][]).map(([bankId, bank]) => (
                    <button key={bankId} onClick={() => selectBank(bankId)}
                            className={`p-5 rounded-xl text-left cursor-pointer duration-300 transition-colors ${selectedBanks.includes(bankId) ? "bg-primary text-white" : "bg-white"}`}>
                        <Heading className="leading-none! mb-0!" level={3}>{bank.name}</Heading>
                    </button>
                ))}
            </div>
            <div className="flex items-center justify-center px-4">
                <AccentButton large background="bg-primary" onClick={() => onSuccess(selectedBanks)}
                              className="justify-center text-base! py-2.5! font-normal! w-full">Продолжить</AccentButton>
            </div>
        </motion.div>
    </>
}

export default BankSelectStep;