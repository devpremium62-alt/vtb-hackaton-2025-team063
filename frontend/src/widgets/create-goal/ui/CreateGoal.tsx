"use client";

import Heading from "@/shared/ui/typography/Heading";
import ModalWindow from "@/shared/ui/ModalWindow";
import {Dispatch, SetStateAction, useEffect} from "react";
import {useForm} from "react-hook-form";
import Input from "@/shared/ui/inputs/Input";
import {Plus} from "@/shared/ui/icons/Plus";
import AccentButton from "@/shared/ui/AccentButton";
import {Card} from "@/shared/ui/icons/Card";
import {yupResolver} from "@hookform/resolvers/yup"
import {schema} from "@/widgets/create-goal/model/schema";
import IconPick from "@/shared/ui/inputs/IconPick";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {addGoal} from "@/entities/goal";
import * as yup from "yup";
import DatePicker from "@/shared/ui/inputs/DatePicker";

type Props = {
    isActive: boolean;
    setActive: Dispatch<SetStateAction<boolean>>;
}

export const CreateGoal = ({isActive, setActive}: Props) => {
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(schema),
    });

    const queryClient = useQueryClient();

    const {mutate: createGoal, isPending} = useMutation({
        mutationFn: addGoal,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["goals"]});
        },
    });

    useEffect(() => {
        setValue("goalIcon", "money");
    }, []);

    const onSubmit = (data: yup.InferType<typeof schema>) => {
        setActive(false);
        reset({goalIcon: "money"});
        createGoal({name: data.goalName, avatar: data.goalIcon, deadline: data.goalDate, moneyNeed: data.goalValue});
    }

    function onIconChange(icon: string) {
        setValue("goalIcon", icon);
    }

    function onDateChange(date: string | null) {
        setValue("goalDate", new Date(date || Date.now()));
    }

    return <ModalWindow isActive={isActive} setActive={setActive}>
        <div className="mb-2.5">
            <Heading level={3}>Новая цель</Heading>
        </div>
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="goalName">Название цели</label>
                    <Input id="goalName" placeholder="Полететь заграницу" error={errors.goalName?.message}
                           large {...register("goalName")}/>
                </div>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="goalValue">Желаемая сумма</label>
                    <div className="relative text-placeholder">
                        <Input className="w-full pr-9" id="goalValue" type="number" placeholder="Например, 120 000₽"
                               error={errors.goalValue?.message} large {...register("goalValue")}/>
                        <Card className="absolute right-2 top-[0.5rem] w-5"/>
                    </div>
                </div>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="paymentDate">Дата цели</label>
                    <DatePicker dateChange={onDateChange} large error={errors.goalDate?.message}/>
                </div>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="goalValue">Иконка</label>
                    <IconPick id="goalValue" onIconChange={onIconChange}/>
                </div>
                <div className="mb-2.5">
                    <AccentButton className="w-full justify-center" large>
                        <Plus className="mr-1"/>
                        Создать цель
                    </AccentButton>
                </div>
            </form>
        </div>
    </ModalWindow>
}