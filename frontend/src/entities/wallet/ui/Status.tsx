"use client";

export const Status = ({percent, isDirty}: { percent: number; isDirty?: boolean; }) => {
    const baseClass = "text-xs font-normal";
    if (percent >= 100) {
        if(!isDirty) {
            return <p className={`${baseClass} text-error`}>Пополните кошелек</p>;
        }

        return <p className={`${baseClass} text-error`}>Лимит исчерпан</p>;
    }

    return <p className={`${baseClass} text-inactive`}>
        {percent >= 80 ? "Почти близок к лимиту" : "В норме"}
    </p>;
}