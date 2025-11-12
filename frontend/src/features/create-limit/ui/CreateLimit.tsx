import Heading from "@/shared/ui/typography/Heading";
import ModalWindow from "@/shared/ui/ModalWindow";
import {Dispatch, SetStateAction} from "react";
import {Controller, useForm} from "react-hook-form";
import Input from "@/shared/ui/inputs/Input";
import {Plus} from "@/shared/ui/icons/Plus";
import AccentButton from "@/shared/ui/AccentButton";
import Select from "@/shared/ui/inputs/Select";
import {Card} from "@/shared/ui/icons/Card";
import {yupResolver} from "@hookform/resolvers/yup"
import {TransactionsCategoriesOptions} from "@/entities/transaction-category";
import {schema} from "@/features/create-limit/model/schema";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {addLimit} from "@/entities/limit";
import * as yup from "yup";
import AnimatedLoader from "@/shared/ui/loaders/AnimatedLoader";

type Props = {
    isActive: boolean;
    setActive: Dispatch<SetStateAction<boolean>>;
}

export const CreateLimit = ({isActive, setActive}: Props) => {
    const {
        handleSubmit,
        reset,
        control,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            limitCategory: "",
            limitName: "",
            limitValue: "" as any,
            limitPeriod: "" as any
        },
    });

    const queryClient = useQueryClient();

    const {mutate: createLimit, isPending} = useMutation({
        mutationFn: addLimit,
        onSuccess: () => {
            reset();
            setActive(false);
            queryClient.invalidateQueries({queryKey: ["limits"]});
        },
    });

    const onSubmit = (data: yup.InferType<typeof schema>) => {
        createLimit({
            name: data.limitName,
            limit: data.limitValue,
            category: Number(data.limitCategory),
            period: data.limitPeriod as any,
        });
    }

    return <ModalWindow isActive={isActive} setActive={setActive}>
        <div className="mb-2.5">
            <Heading level={3}>Новый лимит</Heading>
        </div>
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="limitName">Название лимита</label>
                    <Controller
                        name="limitName"
                        control={control}
                        render={({field}) => (
                            <Input id="limitName" placeholder="Продукты" error={errors.limitName?.message}
                                   large {...field}/>
                        )}
                    />
                </div>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="walletLimit">Лимит</label>
                    <div className="relative text-placeholder">
                        <Controller
                            name="limitValue"
                            control={control}
                            render={({field}) => (
                                <>
                                    <Input className="w-full pr-9" id="limitValue" type="number"
                                           placeholder="Например, 100 000₽"
                                           error={errors.limitValue?.message} large {...field}/>
                                    <Card className="absolute right-2 top-[0.5rem] w-5"/>
                                </>
                            )}
                        />
                    </div>
                </div>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="limitPeriod">Период</label>
                    <Controller
                        name="limitPeriod"
                        control={control}
                        render={({field}) => (
                            <Select error={errors.limitPeriod?.message as string} onChange={(value) => field.onChange(value)}
                                    large value={field.value} placeholder="Выберите период" id="limitPeriod"
                                    options={[{value: "week", label: "Неделя"}, {value: "month", label: "Месяц"}]}/>
                        )}
                    />
                </div>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="limitCategory">Категория</label>
                    <Controller
                        name="limitCategory"
                        control={control}
                        render={({field}) => (
                            <>
                                <Select error={errors.limitCategory?.message} value={field.value}
                                        onChange={(val) => field.onChange(val)} large
                                        placeholder="Выберите категорию" id="limitCategory"
                                        options={TransactionsCategoriesOptions}/>
                            </>
                        )}
                    />
                </div>
                <div className="mb-2.5">
                    <AccentButton className="w-full justify-center" large>
                        <Plus className="mr-1"/>
                        Создать лимит
                    </AccentButton>
                </div>
                <AnimatedLoader isLoading={isPending}/>
            </form>
        </div>
    </ModalWindow>
}