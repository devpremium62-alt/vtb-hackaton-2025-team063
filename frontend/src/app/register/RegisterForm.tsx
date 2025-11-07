"use client";

import {useState} from "react";
import MainStep from "@/app/register/MainStep";
import PhotoStep from "@/app/register/PhotoStep";
import {UserType} from "@/entities/user";
import BankSelectStep from "@/app/register/BankSelectStep";
import FinalStep from "@/app/register/FinalStep";

const RegisterForm = () => {
    const [step, setStep] = useState(0);
    const [userData, setUserData] = useState<Partial<UserType>>({});

    function onMainStepEnd(user: Partial<UserType>) {
        setUserData((prevUser) => ({...prevUser, ...user}));
        setStep(1);
    }

    function onPhotoStepEnd(photo: string) {
        setUserData((prevUser) => ({...prevUser, photo}));
        setStep(2);
    }

    function onBanksStepEnd(banks: string[]) {
        setUserData((prevUser) => ({...prevUser, banks}));
        setStep(3);
    }

    function onRegisterFinished() {

    }

    return <section className="min-h-screen w-full login-page flex flex-col px-4 relative">
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