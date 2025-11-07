"use client";

import Heading from "@/shared/ui/typography/Heading";
import {useState} from "react";
import {Delete} from "@/shared/ui/icons/Delete";
import AccentButton from "@/shared/ui/AccentButton";
import { motion } from "framer-motion";

const AppData = () => {
    const [isPushEnabled, setPushEnabled] = useState(false);

    return <section className="mx-4 md:mr-0 mb-[1.875rem]">
        <div className="mb-2.5">
            <Heading level={2}>О приложении</Heading>
        </div>
        <div className="bg-tertiary rounded-xl px-2.5 py-1.5">
            <motion.div
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -10}}
                        transition={{duration: 0.3}}>
                <div className="flex items-center justify-between text-sm font-medium mb-2.5">
                    <p>Версия</p>
                    <p>{process.env.NEXT_PUBLIC_APP_VERSION}</p>
                </div>
                <AccentButton className="w-full justify-center gap-1 py-1.5" background="bg-error" type="submit">
                    <Delete/>
                    Очистить данные
                </AccentButton>
            </motion.div>
        </div>
    </section>
}

export default AppData;