import {useEffect, useRef, useState} from "react";
import {ChevronDown} from "@/shared/ui/icons/ChevronDown";
import InputError from "@/shared/ui/inputs/InputError";

type Props = {
    className?: string;
    id?: string;
    placeholder?: string;
    onChange?: (value: string) => void;
    options: { value: string; label: string }[];
    large?: boolean;
    error?: string;
}

const Select = ({options, id, className, placeholder, onChange, large, error}: Props) => {
    const [wasSelected, setWasSelected] = useState(false);
    const [value, setValue] = useState(0);
    const [isOpen, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const showPlaceholder = placeholder && !wasSelected;

    function handleChange(value: string, index: number) {
        setWasSelected(true);
        setValue(index);

        if(onChange){
            onChange(value);
        }

        setOpen(false);
    }

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return <>
        <div ref={ref} id={id} className={`relative ${className}`}>
            <div
                onClick={() => setOpen(!isOpen)}
                className={`${showPlaceholder ? "text-placeholder" : "text-primary"} ${error ? "border-error" : ""} ${large ? "text-sm py-2.5" : "py-1.5 text-xs"} pl-1.5 pr-2.5 bg-tertiary rounded-xl flex items-center justify-between gap-4`}>
                <p>{showPlaceholder ? placeholder : options[value].label}</p>
                <ChevronDown className={`transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}/>
            </div>
            <div
                className={`z-10 absolute w-full top-[110%] transition-all duration-300 rounded-xl bg-select overflow-hidden ${isOpen ? " opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1/2 pointer-events-none"}`}>
                <ul className="list-none flex flex-col">
                    {options.map((option, i) => (
                        <li onClick={() => handleChange(option.value, i)}
                            className={`p-2 font-normal text-sm ${i === value && !showPlaceholder ? 'bg-select-active' : ''}`}
                            key={option.value}>{option.label}</li>
                    ))}
                </ul>
            </div>
        </div>
        <InputError error={error}/>
    </>
}

export default Select;