import Heading from "@/shared/ui/typography/Heading";
import ModalWindow from "@/shared/ui/ModalWindow";
import {Dispatch, SetStateAction, useEffect} from "react";
import {Controller, useForm} from "react-hook-form";
import AccentButton from "@/shared/ui/AccentButton";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {executePayment, PaymentType} from "@/entities/payment";
import AnimatedLoader from "@/shared/ui/loaders/AnimatedLoader";
import {Account} from "@/entities/account";
import {AccountSelection} from "@/widgets/account-selection";
import {yupResolver} from "@hookform/resolvers/yup";
import {schema} from "@/features/deposit-payment/model/schema";
import ImageInput from "@/shared/ui/inputs/ImageInput";
import * as yup from "yup";
import {AccountType} from "@/entities/account/model/types";

type Props = {
    isActive: boolean;
    setActive: Dispatch<SetStateAction<boolean>>;
    currentPayment: PaymentType | null;
}

export const DepositPayment = ({isActive, setActive, currentPayment}: Props) => {
    const {
        handleSubmit,
        reset,
        control,
        formState: {errors}
    } = useForm({
        context: {currentPayment},
        resolver: yupResolver(schema),
        defaultValues: {
            depositAccount: null as any
        }
    });

    const queryClient = useQueryClient();

    const {mutate: depositPayment, isPending} = useMutation({
        mutationFn: executePayment,
        onSuccess: () => {
            reset();
            setActive(false);
            queryClient.invalidateQueries({queryKey: ["payments"]});
            queryClient.invalidateQueries({queryKey: ["wallets"]});
            queryClient.invalidateQueries({queryKey: ["child-accounts"]});
            queryClient.invalidateQueries({queryKey: ["family-finance"]});
            queryClient.invalidateQueries({queryKey: ["transactions"]});
            queryClient.invalidateQueries({queryKey: ["family-expenses"]});
        },
    });

    const onSubmit = (data: yup.InferType<typeof schema>) => {
        if (currentPayment) {
            depositPayment({
                paymentId: currentPayment.id,
                amount: Number(currentPayment.value),
                fromAccountId: data.depositAccount.accountId,
                fromAccount: data.depositAccount.account[0].identification,
                fromBank: data.depositAccount.bankId
            });
        }
    }

    return <ModalWindow isActive={isActive} setActive={setActive}>
        <div className="mb-2.5">
            <Heading level={3}>Выполнить платеж</Heading>
        </div>
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="depositAccount">Выберите счет</label>
                    <Controller
                        name="depositAccount"
                        control={control}
                        render={({field}) => (
                            <AccountSelection {...field} id="depositAccount"
                                              error={errors.depositAccount?.message as string}
                                              value={field.value} onChange={(val) => field.onChange(val)}
                            />
                        )}
                    />
                </div>
                <div className="mb-2.5">

                </div>
                <div className="mb-2.5">
                    <AccentButton className="w-full justify-center" large>
                        Внести
                    </AccentButton>
                </div>
                <AnimatedLoader isLoading={isPending}/>
            </form>
        </div>
    </ModalWindow>
}