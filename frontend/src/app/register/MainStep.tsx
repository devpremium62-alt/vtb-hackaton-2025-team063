"use client";

import Image from "next/image";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import Input from "@/shared/ui/inputs/Input";
import * as yup from "yup";
import AccentButton from "@/shared/ui/AccentButton";
import VariantPick from "@/shared/ui/inputs/VariantPick";
import {IMaskInput} from "react-imask";
import InputError from "@/shared/ui/inputs/InputError";
import {useEffect} from "react";

const schema = yup
    .object({
        name: yup
            .string()
            .required("Введите имя"),
        gender: yup
            .string()
            .required("Укажите пол"),
        phone: yup
            .string()
            .required("Укажите номер телефона"),
        phoneConfirmation: yup
            .number()
            .transform((value, originalValue) => {
                return String(originalValue).trim() === "" ? undefined : Number(originalValue);
            })
            .required("Укажите код подтверждения"),
        code: yup
            .number()
            .transform((value, originalValue) => {
                return String(originalValue).trim() === "" ? undefined : Number(originalValue);
            })
            .nullable()
            .notRequired()
            .test("len", "Код должен состоять из 6 цифр", (value) => {
                if (value == null) return true;
                return String(value).length === 6;
            }),
    })
    .required();

type Props = {
    onSuccess: () => void;
}

const MainStep = ({onSuccess}: Props) => {
    const {
        control,
        register,
        handleSubmit,
        setValue,
        reset,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        setValue("gender", "male");
    }, []);

    function onGenderChange(gender: string) {
        setValue("gender", gender);
    }

    const onSubmit = (data: unknown) => {
        console.log(data);
        onSuccess();
    }

    return <div className="p-4 rounded-xl bg-white">
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-2 flex flex-col">
                <Input id="name" placeholder="Валерия" error={errors.name?.message}
                       large {...register("name")}/>
            </div>
            <div className="mb-2 flex flex-col">
                <VariantPick fullSize variants={["male", "female"]} onVariantChange={onGenderChange}
                             element={(value) => {
                                 return <span
                                     className="text-sm font-medium flex-1 my-2.5 inline-block">{value === "male" ? "Мужской" : "Женский"}</span>
                             }}/>
            </div>
            <div className="mb-2 flex flex-col">
                <Controller
                    name="phone"
                    control={control}
                    render={({field}) => (
                        <>
                            <IMaskInput
                                {...field}
                                mask="+{7} (000) 000-00-00"
                                unmask={true}
                                inputRef={field.ref}
                                onAccept={(value) => field.onChange(value)}
                                placeholder="+7 (999) 999-99-99"
                                className={`large text-sm text-primary py-2.5 px-1.5 bg-tertiary rounded-xl font-normal outline-primary ${
                                    errors.phone ? "border-error" : ""
                                }`}
                            />
                            <InputError error={errors.phone?.message}/>
                        </>
                    )}
                />
            </div>
            <div className="mb-2 flex flex-col">
                <Input id="phoneConfirmation" type="number" placeholder="Подтвердить номер телефона"
                       error={errors.phoneConfirmation?.message}
                       large {...register("phoneConfirmation")}/>
            </div>
            <div className="mb-2 flex flex-col">
                <Input id="code" type="number" placeholder="Код приглашения (необязательно)"
                       error={errors.code?.message}
                       large {...register("code")}/>
            </div>
            <div className="mb-2 flex flex-col">
                <AccentButton large background="bg-primary"
                              className="justify-center text-base! py-2.5! font-normal!">Зарегистрироваться</AccentButton>
            </div>
        </form>
    </div>
}

export default MainStep;