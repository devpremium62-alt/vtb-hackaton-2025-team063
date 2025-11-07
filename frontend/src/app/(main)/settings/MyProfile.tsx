"use client";

import Heading from "@/shared/ui/typography/Heading";
import Avatar from "@/shared/ui/Avatar";
import EditableField from "@/app/(main)/settings/EditableField";
import {useState} from "react";
import Checkbox from "@/shared/ui/inputs/Checkbox";
import { motion } from "framer-motion";

type Props = {
    profileData: {
        avatar: string;
        name: string;
        email: string;
        phone: string;
    };
    pushEnabled: boolean;
}

const MyProfile = ({profileData, pushEnabled}: Props) => {
    const [isPushEnabled, setPushEnabled] = useState(false);

    return <section className="mx-4 md:mr-0 mb-[1.875rem]">
        <div className="mb-2.5 flex items-center justify-between">
            <Heading level={2}>Мой профиль</Heading>
            <Avatar avatar={profileData.avatar}/>
        </div>
        <div className="flex flex-col items-stretch gap-1 mb-[1.875rem]">
            <EditableField value={profileData.name} onChange={() => {
            }}/>
            <EditableField value={profileData.phone} onChange={() => {
            }}/>
        </div>
        <div>
            <div className="bg-tertiary rounded-xl px-2.5">
                <motion.div className="h-[2.625rem] flex items-center justify-between"
                            initial={{opacity: 0, y: 10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -10}}
                            transition={{duration: 0.3}}>
                    <p className="text-sm font-medium">Push-уведомления</p>
                    <Checkbox value={isPushEnabled} onChange={setPushEnabled}/>
                </motion.div>
            </div>
        </div>
    </section>
}

export default MyProfile;