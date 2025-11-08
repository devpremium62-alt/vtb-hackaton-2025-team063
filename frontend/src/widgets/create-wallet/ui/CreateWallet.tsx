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
import {schema} from "@/widgets/create-wallet/model/schema";
import {ExpensesCategoriesOptions} from "@/entities/expense-category";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {addWallet} from "@/entities/wallet";
import {BankKeys, banks} from "@/entities/bank";
import * as yup from "yup";
import AnimatedLoader from "@/shared/ui/loaders/AnimatedLoader";

type Props = {
    isActive: boolean;
    setActive: Dispatch<SetStateAction<boolean>>;
}

export const CreateWallet = ({isActive, setActive}: Props) => {
    const {
        handleSubmit,
        reset,
        control,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            walletName: "",
            walletBank: "",
            walletCategory: "",
            walletPeriod: "",
            walletLimit: "" as any,
        },
    });

    const queryClient = useQueryClient();

    const {mutate: createWallet, isPending} = useMutation({
        mutationFn: addWallet,
        onSuccess: () => {
            reset();
            setActive(false);
            queryClient.invalidateQueries({queryKey: ["wallets"]});
        },
    });

    const onSubmit = (data: yup.InferType<typeof schema>) => {
        createWallet({
            limit: data.walletLimit,
            name: data.walletName,
            bank: data.walletBank as BankKeys,
            category: Number(data.walletCategory),
            period: data.walletPeriod as "week" | "month"
        });
    }

    return <ModalWindow isActive={isActive} setActive={setActive}>
        <div className="mb-2.5">
            <Heading level={3}>Новый кошелёк</Heading>
        </div>
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="walletName">Название кошелька</label>
                    <Controller
                        name="walletName"
                        control={control}
                        render={({field}) => (
                            <Input id="walletName" placeholder="Продукты" error={errors.walletName?.message}
                                   large {...field}/>
                        )}
                    />
                </div>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="walletLimit">Лимит</label>
                    <div className="relative text-placeholder">
                        <Controller
                            name="walletLimit"
                            control={control}
                            render={({field}) => (
                                <>
                                    <Input className="w-full pr-9" id="walletLimit" type="number"
                                           placeholder="Например, 100 000₽"
                                           error={errors.walletLimit?.message} large {...field}/>
                                    <Card className="absolute right-2 top-[0.5rem] w-5"/>
                                </>
                            )}
                        />
                    </div>
                </div>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="walletCategory">Категория</label>
                    <Controller
                        name="walletCategory"
                        control={control}
                        render={({field}) => (
                            <Select error={errors.walletCategory?.message} onChange={(value) => field.onChange(value)}
                                    large value={field.value} placeholder="Выберите категорию" id="walletCategory"
                                    options={ExpensesCategoriesOptions}/>
                        )}
                    />
                </div>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="walletPeriod">Период</label>
                    <Controller
                        name="walletPeriod"
                        control={control}
                        render={({field}) => (
                            <Select error={errors.walletPeriod?.message} onChange={(value) => field.onChange(value)}
                                    large value={field.value} placeholder="Выберите период" id="walletPeriod"
                                    options={[{value: "week", label: "Неделя"}, {value: "month", label: "Месяц"}]}/>
                        )}
                    />
                </div>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="walletBank">Банк</label>
                    <Controller
                        name="walletBank"
                        control={control}
                        render={({field}) => (
                            <Select error={errors.walletBank?.message} onChange={(value) => field.onChange(value)}
                                    large placeholder="Выберите банк" value={field.value} id="walletBank"
                                    options={Object.entries(banks).map(([key, value]) => ({
                                        value: key,
                                        label: value.name
                                    }))}/>
                        )}
                    />
                </div>
                <div className="mb-2.5">
                    <AccentButton className="w-full justify-center" large>
                        <Plus className="mr-1"/>
                        Создать кошелек
                    </AccentButton>
                </div>
                <AnimatedLoader isLoading={isPending}/>
            </form>
        </div>
    </ModalWindow>
}