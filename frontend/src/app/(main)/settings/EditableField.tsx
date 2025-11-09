"use client";

import {useEffect, useRef, useState} from "react";
import AccentButton from "@/shared/ui/AccentButton";
import {Edit} from "@/shared/ui/icons/Edit";
import { motion } from "framer-motion";

type Props = {
    value: string;
    onChange: (value: string) => void;
    InputComponent?: React.ElementType;
}

const EditableField = ({value, onChange, InputComponent = "input"}: Props) => {
    const [isEditing, setEditing] = useState(false);
    const [currValue, setValue] = useState(value);
    const [isSaved, setSaved] = useState(false);
    const timeout = useRef<NodeJS.Timeout | null>(null);
    const input = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        return function() {
            clearTimeout(timeout.current!);
        }
    }, []);

    useEffect(() => {
        setValue(value);
    }, [value]);

    useEffect(() => {
        if (isEditing && input.current) {
            input.current.focus();
        }
    }, [isEditing]);

    function onSave() {
        setEditing(false);
        onChange(currValue);
        setSaved(true);

        timeout.current = setTimeout(() => setSaved(false), 2000);
    }

    return <div className="bg-tertiary rounded-xl px-2.5 h-[2.625rem] flex items-center">
        <motion.div className="w-full"
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -10}}
                    transition={{duration: 0.3}}>
            <form className="flex items-center justify-between w-full" action="">
                {isEditing
                    ? <InputComponent
                        ref={input}
                        className="text-sm font-medium"
                        value={currValue}
                        onChange={(e: any) => setValue(e.target?.value ?? e)}
                    />
                    : <p className="text-sm font-medium">{value}</p>
                }

                {isEditing
                    ? <motion.span initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
                                   transition={{duration: 0.3}}>
                        <AccentButton className="text-xs py-1.5" onClick={onSave}>Сохранить изменения</AccentButton>
                    </motion.span>
                    : isSaved
                        ? <motion.span initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
                                       transition={{duration: 0.3}}
                                       className="bg-primary rounded-2xl text-xs py-1.5 px-2.5 text-white">Сохранено!</motion.span>
                        : <motion.button initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
                                         transition={{duration: 0.3}} type="button" className="text-inactive"
                                         onClick={() => setEditing(true)}>
                            <Edit/>
                        </motion.button>
                }
            </form>
        </motion.div>
    </div>
}

export default EditableField;