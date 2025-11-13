"use client";

import InputError from "@/shared/ui/inputs/InputError";
import {forwardRef} from "react";

type Props = {
    large: boolean;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, any & Props>(({className = "", large, error, ...props}: any & Props, ref) => {
    return <>
        <input
            ref={ref}
            className={` ${large ? "large text-primary py-2 px-2.5" : "text-inactive p-1.5"} ${error ? "border-error" : ""} text-base bg-tertiary rounded-xl font-normal outline-primary ${className}`} {...props} />
        <InputError error={error}/>
    </>
});

export default Input;