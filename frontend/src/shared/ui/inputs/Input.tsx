"use client";

import InputError from "@/shared/ui/inputs/InputError";

type Props = {
    large: boolean;
    error?: string;
}

const Input = ({className = "", large, error, ...props}: any & Props) => {
    return <>
        <input
            className={` ${large ? "large text-sm text-primary py-2.5 px-2.5" : "text-xs text-inactive p-1.5"} ${error ? "border-error" : ""} bg-tertiary rounded-xl font-normal outline-primary ${className}`} {...props} />
        <InputError error={error}/>
    </>
}

export default Input;