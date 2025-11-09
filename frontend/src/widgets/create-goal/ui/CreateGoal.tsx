"use client";

import Heading from "@/shared/ui/typography/Heading";
import ModalWindow from "@/shared/ui/ModalWindow";
import {Dispatch, SetStateAction} from "react";
import {Controller, useForm} from "react-hook-form";
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
import Loader from "@/shared/ui/loaders/Loader";
import {AnimatePresence} from "framer-motion";
import AnimatedLoader from "@/shared/ui/loaders/AnimatedLoader";

type Props = {
    isActive: boolean;
    setActive: Dispatch<SetStateAction<boolean>>;
}

export const CreateGoal = ({isActive, setActive}: Props) => {
    const {
        control,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            goalName: "",
            goalValue: "" as any,
            goalDate: null as any,
            goalIcon: "money",
        },
    });

    const queryClient = useQueryClient();

    const {mutate: createGoal, isPending} = useMutation({
        mutationFn: addGoal,
        onSuccess: () => {
            reset();
            setActive(false);
            queryClient.invalidateQueries({queryKey: ["goals"]});
        },
    });

    const onSubmit = (data: yup.InferType<typeof schema>) => {
        createGoal({name: data.goalName, avatar: data.goalIcon, deadline: data.goalDate, moneyNeed: data.goalValue});
    }

    return <ModalWindow isActive={isActive} setActive={setActive}>
        <div className="mb-2.5">
            <Heading level={3}>Новая цель</Heading>
        </div>
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="goalName">Название цели</label>
                    <Controller
                        name="goalName"
                        control={control}
                        render={({field}) => (
                            <Input {...field} id="goalName" placeholder="Полететь заграницу"
                                   error={errors.goalName?.message} large/>
                        )}
                    />
                </div>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="goalValue">Желаемая сумма</label>
                    <div className="relative text-placeholder">
                        <Controller
                            name="goalValue"
                            control={control}
                            render={({field}) => (
                                <>
                                    <Input className="w-full pr-9" id="goalValue" type="number"
                                           placeholder="Например, 120 000₽"
                                           error={errors.goalValue?.message} large {...field}/>
                                    <Card className="absolute right-2 top-[0.5rem] w-5"/>
                                </>
                            )}
                        />
                    </div>
                </div>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="paymentDate">Дата цели</label>
                    <Controller
                        name="goalDate"
                        control={control}
                        render={({field}) => {
                            return <DatePicker
                                date={field.value?.toISOString()}
                                large
                                error={errors.goalDate?.message as string}
                                dateChange={(val) => field.onChange(val ? new Date(val) : null)}
                            />
                        }}
                    />
                </div>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="goalIcon">Иконка</label>
                    <Controller
                        name="goalIcon"
                        control={control}
                        render={({field}) => {
                            return <IconPick id="goalIcon" icon={field.value}
                                             onIconChange={(val) => field.onChange(val)}/>
                        }}
                    />
                </div>
                <div className="mb-2.5">
                    <AccentButton disabled={isPending} className="w-full justify-center" large>
                        <Plus className="mr-1"/>
                        Создать цель
                    </AccentButton>
                </div>
                <AnimatedLoader isLoading={isPending}/>
            </form>
        </div>
    </ModalWindow>
}