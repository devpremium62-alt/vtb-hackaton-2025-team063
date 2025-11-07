"use client";

import Heading from "@/shared/ui/typography/Heading";
import ModalWindow from "@/shared/ui/ModalWindow";
import {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import AccentButton from "@/shared/ui/AccentButton";
import InfoPopup from "@/shared/ui/InfoPopup";

type Props = {
    isActive: boolean;
    setActive: Dispatch<SetStateAction<boolean>>;
    code: number;
    validTo: Date;
}

function diffTime(date1: Date, date2: Date): string {
    let diffMs = Math.abs(date2.getTime() - date1.getTime());

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    diffMs -= hours * 1000 * 60 * 60;

    const minutes = Math.floor(diffMs / (1000 * 60));
    diffMs -= minutes * 1000 * 60;

    const seconds = Math.floor(diffMs / 1000);

    return `${hours}ч ${minutes}м ${seconds}с`;
}

export const InvitePartner = ({code, validTo, isActive, setActive}: Props) => {
    const [validFor, setValidFor] = useState("");
    const [isCopied, setCopied] = useState(false);
    const interval = useRef<NodeJS.Timeout | null>(null);

    const codeStr = code.toString().slice(0, 3) + " " + code.toString().slice(3);

    useEffect(() => {
        interval.current = setInterval(() => {
            setValidFor(diffTime(new Date(), validTo));
        }, 1000);

        return function () {
            clearInterval(interval.current!);
        }
    }, []);

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(code.toString());
            setCopied(true);
        } catch (err) {
            console.error("Ошибка копирования:", err);
        }
    }

    return <ModalWindow isActive={isActive} setActive={setActive}>
        <div className="mb-2.5">
            <Heading level={3}>Пригласить партнера</Heading>
        </div>
        <div className="mb-2.5">
            <p className="text-xs text-secondary font-medium mb-1">Поделитесь этим кодом с вашим партнёром</p>
            <div className="bg-tertiary h-32 rounded-xl flex flex-col items-center justify-center">
                <div>
                    <p className="text-active text-[2.5rem] font-bold mb-3 leading-none">{codeStr}</p>
                    <p className="text-secondary text-xs">Действителен: {validFor}</p>
                </div>
            </div>
        </div>
        <div className="mb-2.5">
            <AccentButton onClick={handleCopy} className="w-full justify-center gap-1 py-2 text-xs">Скопировать</AccentButton>
        </div>
        <InfoPopup className="-top-15!" text="Код успешно скопирован!" time={2000} isActive={isCopied} setActive={setCopied}/>
    </ModalWindow>
}