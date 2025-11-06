"use client";

export const Status = ({percent}: { percent: number }) => {
    const baseClass = "text-xs font-normal";
    if (percent >= 100) {
        return <p className={`${baseClass} text-error`}>Лимит исчерпан</p>;
    }

    return <p className={`${baseClass} text-light`}>
        {percent >= 80 ? "Почти близок к лимиту" : "В норме"}
    </p>;
}