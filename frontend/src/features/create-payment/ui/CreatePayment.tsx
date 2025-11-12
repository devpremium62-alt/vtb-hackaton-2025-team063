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
import {schema} from "@/features/create-payment/model/schema";
import {TransactionsCategoriesOptions} from "@/entities/transaction-category";
import DatePicker from "@/shared/ui/inputs/DatePicker";
import * as yup from "yup";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {addPayment} from "@/entities/payment";
import AnimatedLoader from "@/shared/ui/loaders/AnimatedLoader";

type Props = {
    isActive: boolean;
    setActive: Dispatch<SetStateAction<boolean>>;
}

export const CreatePayment = ({isActive, setActive}: Props) => {
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            paymentName: "",
            paymentCategory: "",
            paymentDate: "" as any,
            paymentValue: "" as any,
        },
    });

    const queryClient = useQueryClient();

    const {mutate: createPayment, isPending} = useMutation({
        mutationFn: addPayment,
        onSuccess: () => {
            reset();
            setActive(false);
            queryClient.invalidateQueries({queryKey: ["payments"]});
        },
    });

    const onSubmit = (data: yup.InferType<typeof schema>) => {
        createPayment({
            name: data.paymentName,
            category: Number(data.paymentCategory),
            date: data.paymentDate,
            value: data.paymentValue
        });
    }

    return <ModalWindow isActive={isActive} setActive={setActive}>
        <div className="mb-2.5">
            <Heading level={3}>Новый платеж</Heading>
        </div>
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="paymentName">Название платежа</label>
                    <Controller
                        name="paymentName"
                        control={control}
                        render={({field}) => (
                            <Input id="paymentName" placeholder="На квартиру" error={errors.paymentName?.message}
                                   large {...field}/>
                        )}
                    />
                </div>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="paymentValue">Сумма платежа</label>
                    <div className="relative text-placeholder">
                        <Controller
                            name="paymentValue"
                            control={control}
                            render={({field}) => (
                                <>
                                    <Input className="w-full pr-9" id="paymentValue" {...field} type="number"
                                           placeholder="Например, 7 000₽"
                                           error={errors.paymentValue?.message} large {...register("paymentValue")}/>
                                    <Card className="absolute right-2 top-[0.5rem] w-5"/>
                                </>
                            )}
                        />
                    </div>
                </div>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="paymentDate">Дата платежа</label>
                    <Controller
                        name="paymentDate"
                        control={control}
                        render={({field}) => (
                            <DatePicker date={field.value} dateChange={(val) => field.onChange(val)} large
                                        error={errors.paymentDate?.message as string}/>
                        )}
                    />
                </div>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="paymentCategory">Категория</label>
                    <Controller
                        name="paymentCategory"
                        control={control}
                        render={({field}) => (
                            <Select value={field.value} error={errors.paymentCategory?.message}
                                    onChange={(val) => field.onChange(val)} large
                                    placeholder="Выберите категорию" id="paymentCategory"
                                    options={TransactionsCategoriesOptions}/>
                        )}
                    />
                </div>
                <div className="mb-2.5">
                    <AccentButton className="w-full justify-center" large>
                        <Plus className="mr-1"/>
                        Добавить
                    </AccentButton>
                </div>
                <AnimatedLoader isLoading={isPending}/>
            </form>
        </div>
    </ModalWindow>
}