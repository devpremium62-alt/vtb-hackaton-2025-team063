import Heading from "@/shared/ui/typography/Heading";
import ModalWindow from "@/shared/ui/ModalWindow";
import {Dispatch, SetStateAction, useEffect} from "react";
import {Controller, useForm} from "react-hook-form";
import Input from "@/shared/ui/inputs/Input";
import {Plus} from "@/shared/ui/icons/Plus";
import AccentButton from "@/shared/ui/AccentButton";
import {yupResolver} from "@hookform/resolvers/yup"
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {BankKey, banks, createConsent} from "@/entities/bank";
import * as yup from "yup";
import AnimatedLoader from "@/shared/ui/loaders/AnimatedLoader";
import {usePopup} from "@/providers/GlobalPopupProvider";
import {Check} from "@/shared/ui/icons/Check";
import {schema} from "@/features/create-bank-consent/model/schema";

type Props = {
    isActive: boolean;
    setActive: Dispatch<SetStateAction<boolean>>;
    clientId?: string | null;
    bankId?: BankKey | null;
}

export const CreateBankConsent = ({isActive, setActive, bankId, clientId}: Props) => {
    const {
        handleSubmit,
        reset,
        control,
        setValue,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            clientId: ""
        },
    });

    const {showPopup} = usePopup();

    useEffect(() => {
        setValue("clientId", clientId || "");
    }, [clientId]);

    const queryClient = useQueryClient();

    const {mutate: makeConsent, isPending} = useMutation({
        mutationFn: createConsent,
        onSuccess: () => {
            reset();
            setActive(false);
            showPopup({
                text: "Банк успешно подключен!",
                icon: () => <Check/>
            });
            queryClient.invalidateQueries({queryKey: ["consents"]});
        },
    });

    const onSubmit = (data: yup.InferType<typeof schema>) => {
        makeConsent({bankId: bankId!, clientId: data.clientId});
    }

    return <ModalWindow isActive={isActive} setActive={setActive}>
        <div className="mb-2.5">
            <Heading level={3}>Подключение {bankId && banks[bankId].name}</Heading>
        </div>
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="clientId">Идентификатор клиента</label>
                    <Controller
                        name="clientId"
                        control={control}
                        render={({field}) => (
                            <Input id="clientId" placeholder="team063-1" error={errors.clientId?.message}
                                   large {...field}/>
                        )}
                    />
                </div>
                <div className="mb-2.5">
                    <AccentButton className="w-full justify-center" large>
                        <Plus className="mr-1"/>
                        Подключить
                    </AccentButton>
                </div>
                <AnimatedLoader isLoading={isPending}/>
            </form>
        </div>
    </ModalWindow>
}