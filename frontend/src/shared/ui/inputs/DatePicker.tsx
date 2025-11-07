"use client";

import {useEffect, useRef, useState} from "react";
import {Popover} from "@mantine/core";
import dayjs from "dayjs";
import 'dayjs/locale/ru';
import Input from "@/shared/ui/inputs/Input";
import {DatePicker} from "@mantine/dates";

type Props = {
    dateChange: (date: string | null) => void;
    large?: boolean;
    error?: string;
}

export default function DatePickerCompoent({large, error, dateChange}: Props) {
    const [opened, setOpened] = useState(false);
    const [value, setValue] = useState<string | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleChange = (date: string | null) => {
        setValue(date);
        dateChange(date);
        setOpened(false);
    };

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpened(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={wrapperRef} className="relative w-full">
            <div onClick={() => setOpened((o) => !o)} className="w-full cursor-pointer">
                <Input
                    className="w-full"
                    readOnly
                    large={large}
                    error={error}
                    placeholder="Выберите дату"
                    value={value ? dayjs(value).format("DD.MM.YYYY") : ""}
                />
            </div>

            {opened && (
                <div className="absolute left-0 top-full mt-1 z-50 shadow-lg rounded-xl overflow-hidden bg-white">
                    <DatePicker
                        locale="ru"
                        value={value}
                        onChange={handleChange}
                        className="p-2"
                    />
                </div>
            )}
        </div>
    );
}