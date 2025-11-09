import Heading from "@/shared/ui/typography/Heading";
import ModalWindow from "@/shared/ui/ModalWindow";
import {Dispatch, SetStateAction} from "react";
import {useForm} from "react-hook-form";
import AccentButton from "@/shared/ui/AccentButton";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {executePayment} from "@/entities/payment";
import AnimatedLoader from "@/shared/ui/loaders/AnimatedLoader";

type Props = {
    isActive: boolean;
    setActive: Dispatch<SetStateAction<boolean>>;
    currentPaymentId: number | null;
}

export const DepositPayment = ({isActive, setActive, currentPaymentId}: Props) => {
    const {
        handleSubmit,
        reset,
    } = useForm();

    const queryClient = useQueryClient();

    const {mutate: depositPayment, isPending} = useMutation({
        mutationFn: executePayment,
        onSuccess: () => {
            reset();
            setActive(false);
            queryClient.invalidateQueries({queryKey: ["payments"]});
            queryClient.invalidateQueries({queryKey: ["shared-accounts"]});
            queryClient.invalidateQueries({queryKey: ["personal-accounts"]});
            queryClient.invalidateQueries({queryKey: ["expenses"]});
            queryClient.invalidateQueries({queryKey: ["expense-categories"]});
        },
    });

    const onSubmit = () => {
        if(currentPaymentId) {
            depositPayment(currentPaymentId);
        }
    }

    return <ModalWindow isActive={isActive} setActive={setActive}>
        <div className="mb-2.5">
            <Heading level={3}>Выполнить платеж</Heading>
        </div>
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
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