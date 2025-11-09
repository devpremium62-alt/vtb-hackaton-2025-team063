"use client";

import {useState} from "react";
import MainStep from "@/app/register/MainStep";
import PhotoStep from "@/app/register/PhotoStep";
import {registerUser, UserType} from "@/entities/user";
import BankSelectStep from "@/app/register/BankSelectStep";
import FinalStep from "@/app/register/FinalStep";
import { useRouter } from "next/navigation";
import {useMutation} from "@tanstack/react-query";
import {BankKey} from "@/entities/bank";

const RegisterForm = () => {
    const [step, setStep] = useState(0);
    const [userData, setUserData] = useState<Partial<UserType>>({});
    const router = useRouter();

    function onMainStepEnd(user: Partial<UserType>) {
        setUserData((prevUser) => ({...prevUser, ...user}));
        setStep(1);
    }

    function onPhotoStepEnd(photo: string) {
        setUserData((prevUser) => ({...prevUser, photo}));
        setStep(2);
    }

    function onBanksStepEnd(banks: BankKey[]) {
        setUserData((prevUser) => ({...prevUser, banks}));
        setStep(3);
    }

    const {mutate: register, isPending} = useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            router.push("/dashboard");
        },
    });

    function onRegisterFinished() {
        register({name: userData.name!, phone: userData.phone!, image_url: userData.photo!});
    }

    return <section className="min-h-screen w-full max-w-md login-page flex flex-col px-4 relative">
        {step === 0 && <MainStep onSuccess={onMainStepEnd}/>}
        {step === 1 && <PhotoStep onSuccess={onPhotoStepEnd}/>}
        {step === 2 && <BankSelectStep onSuccess={onBanksStepEnd}/>}
        {step === 3 && <FinalStep user={userData} onSuccess={onRegisterFinished}/>}

        <div
            className="absolute bottom-7 left-1/2 -translate-x-1/2 flex items-center justify-center gap-0.5 w-full">
            {Array.from({length: 4}).map((_, i) => (
                <div key={i}
                     className={`${step === i ? "w-14" : "w-1.5"} transition-all duration-500 h-1.5 bg-primary rounded-full`}></div>
            ))}
        </div>
    </section>
}

export default RegisterForm;