"use client";

import {useEffect, useState} from "react";
import MainStep from "@/app/register/MainStep";
import PhotoStep from "@/app/register/PhotoStep";
import Image from "next/image";

const RegisterForm = () => {
    const [step, setStep] = useState(0);

    return <section className="h-screen flex flex-col justify-center p-4 relative">
        <div className="mb-10 flex flex-col items-center">
            <div className="mb-1">
                <Image width={70} height={51} src="/images/logo.png" alt="Семейный мультибанк"></Image>
            </div>
            <div className="flex flex-col items-center text-center">
                <h1 className="text-3xl font-semibold leading-none mb-1.5">Добро пожаловать в семейный мультибанк!</h1>
                <p className="max-w-72 font-normal text-secondary leading-tight">Единое финансовое пространство для вас и ваших
                    близких</p>
            </div>
        </div>
        {step === 0 ? <MainStep onSuccess={() => setStep(1)}/> : <PhotoStep/>}

        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex items-center justify-center gap-0.5 w-full">
            <div
                className={`${step === 0 ? "w-14" : "w-1.5"} transition-all duration-500 h-1.5 bg-primary rounded-full`}></div>
            <div
                className={`${step === 1 ? "w-14" : "w-1.5"} transition-all duration-500 h-1.5 bg-primary rounded-full`}></div>
        </div>
    </section>
}

export default RegisterForm;