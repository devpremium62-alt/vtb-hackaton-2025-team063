"use client";

import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import Input from "@/shared/ui/inputs/Input";
import * as yup from "yup";
import AccentButton from "@/shared/ui/AccentButton";
import VariantPick from "@/shared/ui/inputs/VariantPick";
import {IMaskInput} from "react-imask";
import InputError from "@/shared/ui/inputs/InputError";
import {useEffect, useState} from "react";
import { motion } from "framer-motion";
import MainHead from "@/app/register/MainHead";
import {UserType} from "@/entities/user";

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
    onSuccess: (user: Partial<UserType>) => void;
}

const MainStep = ({onSuccess}: Props) => {
    const {
        control,
        register,
        handleSubmit,
        setValue,
        trigger,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [codeSent, setCodeSent] = useState(false);

    useEffect(() => {
        setValue("gender", "male");
    }, []);

    function onGenderChange(gender: string) {
        setValue("gender", gender);
    }

    const onSubmit = (data: yup.InferType<typeof schema>) => {
        onSuccess(data);
    }

    async function sendCode(){
        const valid = await trigger("phone");
        if (!valid) {
            return;
        }

        setCodeSent(true);
    }

    return <>
        <MainHead/>
        <motion.div className="p-4 rounded-xl bg-white"
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -10}}
                    transition={{duration: 0.3}}>
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
                                <div className="flex items-stretch gap-2">
                                    <IMaskInput
                                        {...field}
                                        mask="+{7} (000) 000-00-00"
                                        unmask={false}
                                        value={field.value || ""}
                                        onAccept={(value) => field.onChange(value)}
                                        placeholder="+7 (999) 999-99-99"
                                        className={`min-w-0 flex-1 large text-sm text-primary py-2.5 px-2.5 bg-tertiary rounded-xl font-normal outline-primary ${
                                            errors.phone ? "border-error" : ""
                                        }`}
                                    />
                                    <AccentButton disabled={codeSent} large background={codeSent ? "bg-secondary" : "bg-primary"} type="button" onClick={sendCode}
                                                  className={`shrink-0 justify-center py-2.5! font-normal!`}>{codeSent ? "Код отправлен" : "Получить код"}</AccentButton>
                                </div>

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
        </motion.div>
    </>
}

export default MainStep;