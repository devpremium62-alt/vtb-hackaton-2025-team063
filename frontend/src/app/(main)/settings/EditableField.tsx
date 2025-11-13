"use client";

import {ElementType, useEffect, useRef, useState} from "react";
import AccentButton from "@/shared/ui/AccentButton";
import {Edit} from "@/shared/ui/icons/Edit";
import { motion } from "framer-motion";
import {MutationFunction, useMutation} from "@tanstack/react-query";
import Loader from "@/shared/ui/loaders/Loader";

type Props = {
    value: string;
    onSuccess: () => void;
    transformValue: (value: string) => any;
    mutationFn: MutationFunction<any, any>;
    InputComponent?: ElementType;
}

const EditableField = ({value, onSuccess, mutationFn, transformValue, InputComponent = "input"}: Props) => {
    const [isEditing, setEditing] = useState(false);
    const [currValue, setValue] = useState(value);
    const [isSaved, setSaved] = useState(false);
    const timeout = useRef<NodeJS.Timeout | null>(null);
    const input = useRef<HTMLInputElement | null>(null);

    const {mutate, isPending} = useMutation({
        mutationFn,
        onSuccess: () => {
            setEditing(false);
            setSaved(true);
            timeout.current = setTimeout(() => setSaved(false), 2000);
            onSuccess();
        },
    });

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
        mutate(transformValue(currValue));
    }

    return <div className="bg-tertiary rounded-xl px-2.5 h-[2.625rem] flex items-center">
        <motion.div className="w-full"
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -10}}
                    transition={{duration: 0.3}}>
            <form className="flex items-center justify-between w-full gap-1 max-w-full" onSubmit={(e) => e.preventDefault()}>
                {isEditing
                    ? <InputComponent
                        ref={input}
                        className="text-base font-medium flex-1 min-w-0"
                        value={currValue}
                        onChange={(e: any) => setValue(e.target?.value ?? e)}
                    />
                    : <p className="text-base font-medium">{value}</p>
                }

                {isEditing
                    ? isPending
                        ? <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
                                       transition={{duration: 0.3}}>
                            <Loader border={0.15} size={1.5}/>
                        </motion.div>
                        : <motion.span initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
                                       transition={{duration: 0.3}}>
                            <AccentButton type="button" className="text-xs shrink-0 whitespace-nowrap py-1.5" onClick={onSave}>Сохранить изменения</AccentButton>
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