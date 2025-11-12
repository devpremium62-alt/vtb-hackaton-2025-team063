"use client";

import Heading from "@/shared/ui/typography/Heading";
import ModalWindow from "@/shared/ui/ModalWindow";
import {Dispatch, SetStateAction, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import Input from "@/shared/ui/inputs/Input";
import {Plus} from "@/shared/ui/icons/Plus";
import AccentButton from "@/shared/ui/AccentButton";
import {yupResolver} from "@hookform/resolvers/yup"
import {schema} from "@/features/create-child-account/model/schema";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {addGoal} from "@/entities/goal";
import * as yup from "yup";
import AnimatedLoader from "@/shared/ui/loaders/AnimatedLoader";
import BankSelect from "@/shared/ui/inputs/BankSelect";
import ImageInput from "@/shared/ui/inputs/ImageInput";
import {BankKey, banks} from "@/entities/bank";
import Select from "@/shared/ui/inputs/Select";
import {createChildAccount} from "@/entities/child-account/api/api";

type Props = {
    isActive: boolean;
    setActive: Dispatch<SetStateAction<boolean>>;
}

export const CreateChildAccount = ({isActive, setActive}: Props) => {
    const {
        control,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            accountBankId: "",
            accountMoneyPerDay: "" as any,
            accountAvatar: "" as any,
        },
    });

    const queryClient = useQueryClient();

    const {mutate: addChildAccount, isPending} = useMutation({
        mutationFn: createChildAccount,
        onSuccess: () => {
            reset();
            setActive(false);
            queryClient.invalidateQueries({queryKey: ["child-accounts"]});
        },
    });

    const onSubmit = (data: yup.InferType<typeof schema>) => {
        const formData = new FormData();
        formData.append("moneyPerDay", String(data.accountMoneyPerDay));
        formData.append("avatar", data.accountAvatar as File);
        formData.append("bankId", data.accountBankId);

        addChildAccount(formData);
    }

    return <ModalWindow isActive={isActive} setActive={setActive}>
        <div className="mb-2.5">
            <Heading level={3}>Новый детский счет</Heading>
        </div>
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="accountAvatar">Изображение</label>
                    <Controller
                        name="accountAvatar"
                        control={control}
                        render={({field}) => (
                            <ImageInput error={errors.accountAvatar?.message as string}
                                onChange={(value) => field.onChange(value)}
                                large placeholder="Выберите изображение" value={field.value} id="accountAvatar"/>
                        )}
                    />
                </div>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="accountMoneyPerDay">Сумма в день</label>
                    <Controller
                        name="accountMoneyPerDay"
                        control={control}
                        render={({field}) => (
                            <Input {...field} id="accountMoneyPerDay" type="number" placeholder="Например, 1 500₽"
                                   error={errors.accountMoneyPerDay?.message} large/>
                        )}
                    />
                </div>
                <BankSelect name="accountBankId" control={control} error={errors.accountBankId?.message as string}/>
                <div className="mb-2.5">
                    <AccentButton disabled={isPending} className="w-full justify-center" large>
                        <Plus className="mr-1"/>
                        Создать детский счет
                    </AccentButton>
                </div>
                <AnimatedLoader isLoading={isPending}/>
            </form>
        </div>
    </ModalWindow>
}