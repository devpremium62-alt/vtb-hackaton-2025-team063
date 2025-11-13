"use client";

import {motion} from "framer-motion";
import RegisterHead from "@/app/register/RegisterHead";
import {useFormattedPhone, UserInputType} from "@/entities/user";
import Image from "next/image";
import Heading from "@/shared/ui/typography/Heading";
import AccentButton from "@/shared/ui/AccentButton";
import {banks} from "@/entities/bank";

type Props = {
    user: Partial<UserInputType>;
    onSuccess: () => void;
}

const FinalStep = ({user, onSuccess}: Props) => {
    const formattedPhone = useFormattedPhone(user.phone!);

    return <>
        <RegisterHead>
            <h1 className="text-3xl font-semibold leading-none mb-1.5">Отлично! Ваш профиль готов. Приступаем?</h1>
        </RegisterHead>
        <motion.div
            className="flex items-center flex-col"
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -10}}
            transition={{duration: 0.3}}>
            <div className="w-fit px-10 py-2.5 rounded-xl bg-white flex flex-col items-center gap-2 text-center mb-10">
                <div className="w-[7.5rem] h-[7.5rem] relative">
                    <Image className="rounded-full object-cover" src={user.photoSrc!} alt={user.name!} fill sizes="7.5rem"/>
                </div>
                <div>
                    <Heading className="mb-1" level={3}>{user.name}</Heading>
                    <p className="font-medium text-secondary text-lg leading-none">{formattedPhone}</p>
                </div>
                <div className="flex items-center flex-wrap gap-1">
                    {user.banks?.map((b) => {
                        return (
                            <span key={b} className="text-xs font-normal rounded-2xl py-1 px-2.5 text-white"
                                  style={{background: banks[b].color}}>{banks[b].name}</span>
                        );
                    })}
                </div>
            </div>
            <div className="w-full flex items-center justify-center px-4">
                <AccentButton large background="bg-primary" onClick={() => onSuccess()}
                              className="justify-center py-2.5! font-normal! w-full">Завершить
                    регистрацию</AccentButton>
            </div>
        </motion.div>
    </>
}

export default FinalStep;