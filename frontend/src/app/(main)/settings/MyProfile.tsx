"use client";

import Heading from "@/shared/ui/typography/Heading";
import Avatar from "@/shared/ui/Avatar";
import EditableField from "@/app/(main)/settings/EditableField";
import {forwardRef, useEffect, useState} from "react";
import Checkbox from "@/shared/ui/inputs/Checkbox";
import {motion} from "framer-motion";
import {UserFromResponse, UserType} from "@/entities/user";
import {IMaskInput} from "react-imask";

const MaskedPhoneInput = forwardRef<HTMLInputElement, any>((props, ref) => (
    <IMaskInput
        {...props}
        inputRef={ref}
        mask="+{7} (000) 000-00-00"
        unmask={false}
        className="min-w-0 flex-1 large text-sm text-primary py-2.5 px-2.5 bg-tertiary rounded-xl font-normal outline-primary"
    />
));

type Props = {
    settings: {
        pushEnabled: boolean;
    }
}

const MyProfile = ({settings}: Props) => {
    const [profileData, setProfileData] = useState<UserFromResponse | null>(null);
    const [isPushEnabled, setPushEnabled] = useState(settings.pushEnabled);

    useEffect(() => {
        const userJSON = localStorage.getItem("user");
        if (!userJSON) {
            return;
        }

        const userData = JSON.parse(userJSON);
        setProfileData(userData.user);
    }, []);

    function updateProfileData(newProfile: UserFromResponse) {
        setProfileData(newProfile);
        const userJSON = localStorage.getItem("user");
        if (!userJSON) {
            return;
        }

        const userData = JSON.parse(userJSON);
        userData.user = newProfile;
        localStorage.setItem("user", JSON.stringify(userData));
    }

    return <section className="mx-4 md:mr-0 mb-[1.875rem]">
        <div className="mb-2.5 flex items-center justify-between">
            <Heading level={2}>Мой профиль</Heading>
            <Avatar avatar={profileData?.image_url || ""}/>
        </div>
        <div className="flex flex-col items-stretch gap-1 mb-[1.875rem]">
            <EditableField value={profileData?.name || ""} onChange={(value) => {
                updateProfileData({...profileData as UserFromResponse, name: value});
            }}/>
            <EditableField InputComponent={MaskedPhoneInput} value={profileData?.phone || ""} onChange={(value) => {
                updateProfileData({...profileData as UserFromResponse, phone: value});
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