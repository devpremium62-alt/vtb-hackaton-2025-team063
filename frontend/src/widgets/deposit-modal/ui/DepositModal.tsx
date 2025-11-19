import Heading from "@/shared/ui/typography/Heading";
import ModalWindow from "@/shared/ui/ModalWindow";
import {Dispatch, SetStateAction} from "react";
import {Controller, useForm} from "react-hook-form";
import Input from "@/shared/ui/inputs/Input";
import {Plus} from "@/shared/ui/icons/Plus";
import AccentButton from "@/shared/ui/AccentButton";
import {Card} from "@/shared/ui/icons/Card";
import {yupResolver} from "@hookform/resolvers/yup"
import {MutationFunction, useMutation, useQueryClient} from "@tanstack/react-query";
import AnimatedLoader from "@/shared/ui/loaders/AnimatedLoader";
import * as yup from "yup";
import {AccountSelection} from "@/widgets/account-selection";
import {getSchema} from "@/widgets/deposit-modal/model/schema";

type Props = {
    isActive: boolean;
    setActive: Dispatch<SetStateAction<boolean>>;
    activeAccountId?: string;
    onSuccess?: () => void;
    entityName: string;
    mutationFn: MutationFunction<any, any>;
    maxValue?: number;
}

export const DepositModal = ({
                                 isActive, mutationFn, setActive,
                                 activeAccountId, entityName, maxValue,
                                 onSuccess
                             }: Props) => {
    const {
        handleSubmit,
        reset,
        control,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(getSchema(maxValue === undefined ? 10_000_000 : maxValue)),
        defaultValues: {
            value: "" as any,
            accountFrom: null as any
        }
    });

    const {mutate, isPending} = useMutation({
        mutationFn,
        onSuccess: () => {
            reset();
            setActive(false);

            if (onSuccess) {
                onSuccess();
            }
        },
    });

    const onSubmit = (data: yup.InferType<ReturnType<typeof getSchema>>) => {
        if (activeAccountId) {
            mutate({
                entityId: activeAccountId,
                amount: data.value,
                fromAccountId: data.accountFrom.accountId,
                fromAccount: data.accountFrom.account[0].identification,
                fromBank: data.accountFrom.bankId
            });
        }
    }

    return <ModalWindow isActive={isActive} setActive={setActive}>
        <div className="mb-2.5">
            <Heading level={3}>Пополнить счет</Heading>
        </div>
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor={`${entityName}-value`}>Желаемая сумма</label>
                    <div className="relative text-placeholder">
                        <Controller
                            name="value"
                            control={control}
                            render={({field}) => (
                                <>
                                    <Input {...field} className="w-full pr-9" id={`${entityName}-value`} type="number"
                                           placeholder="Например, 10 000₽"
                                           error={errors.value?.message}
                                           large/>
                                    <Card className="absolute right-2 top-[0.5rem] w-5"/>
                                </>
                            )}
                        />
                    </div>
                </div>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor={`${entityName}-accountFrom`}>Выберите
                        счет</label>
                    <Controller
                        name="accountFrom"
                        control={control}
                        render={({field}) => (
                            <AccountSelection {...field} id={`${entityName}-accountFrom`}
                                              error={errors.accountFrom?.message as string}
                                              value={field.value} onChange={(val) => field.onChange(val)}
                                              excluded={[activeAccountId]}
                            />
                        )}
                    />
                </div>
                <div className="mb-2.5">
                    <AccentButton disabled={isPending} className="w-full justify-center" large>
                        <Plus className="mr-1"/>
                        Пополнить
                    </AccentButton>
                </div>
                <AnimatedLoader isLoading={isPending}/>
            </form>
        </div>
    </ModalWindow>
}