"use client";

import Heading from "@/shared/ui/typography/Heading";
import Avatar from "@/shared/ui/Avatar";
import {useState} from "react";
import Checkbox from "@/shared/ui/inputs/Checkbox";
import {motion} from "framer-motion";
import {useQuery} from "@tanstack/react-query";
import getAbsoluteSeverUrl from "@/shared/lib/getAbsoluteServerUrl";
import {authUser} from "@/entities/user";
import ProfileEditableData from "@/app/(main)/settings/ProfileEditableData";


type Props = {
    settings: {
        pushEnabled: boolean;
    }
}

const MyProfile = ({settings}: Props) => {
    const [isPushEnabled, setPushEnabled] = useState(settings.pushEnabled);

    const {data: user = null} = useQuery({
        queryKey: ["user"],
        queryFn: authUser,
        refetchOnReconnect: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    return <section className="mx-4 md:mr-0 mb-[1.875rem]">
        <div className="mb-2.5 flex items-center justify-between">
            <Heading level={2}>Мой профиль</Heading>
            <Avatar avatar={getAbsoluteSeverUrl(user?.avatar)}/>
        </div>
        <ProfileEditableData user={user}/>
        <div>
            <div className="bg-tertiary rounded-xl px-2.5">
                <motion.div className="h-[2.625rem] flex items-center justify-between"
                            initial={{opacity: 0, y: 10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -10}}
                            transition={{duration: 0.3}}>
                    <p className="text-base font-medium">Push-уведомления</p>
                    <Checkbox value={isPushEnabled} onChange={setPushEnabled}/>
                </motion.div>
            </div>
        </div>
    </section>
}

export default MyProfile;