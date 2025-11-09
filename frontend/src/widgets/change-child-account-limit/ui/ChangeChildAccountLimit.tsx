import Heading from "@/shared/ui/typography/Heading";
import ModalWindow from "@/shared/ui/ModalWindow";
import {Dispatch, SetStateAction} from "react";
import {Controller, useForm} from "react-hook-form";
import Input from "@/shared/ui/inputs/Input";
import AccentButton from "@/shared/ui/AccentButton";
import {Card} from "@/shared/ui/icons/Card";
import {yupResolver} from "@hookform/resolvers/yup"
import {schema} from "@/widgets/change-child-account-limit/model/schema";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {changeLimit, depositMoney} from "@/entities/child-account";
import * as yup from "yup";
import AnimatedLoader from "@/shared/ui/loaders/AnimatedLoader";

type Props = {
    isActive: boolean;
    setActive: Dispatch<SetStateAction<boolean>>;
}

export const ChangeChildAccountLimit = ({isActive, setActive}: Props) => {
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            chilAccountnewLimit: "" as any
        }
    });

    const queryClient = useQueryClient();

    const {mutate: sendNewLimit, isPending} = useMutation({
        mutationFn: changeLimit,
        onSuccess: () => {
            reset();
            setActive(false);
            queryClient.invalidateQueries({queryKey: ["child-account"]});
        },
    });

    const onSubmit = (data: yup.InferType<typeof schema>) => {
        sendNewLimit(data.chilAccountnewLimit);
    }

    return <ModalWindow isActive={isActive} setActive={setActive}>
        <div className="mb-2.5">
            <Heading level={3}>Изменить лимит счета</Heading>
        </div>
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="chilAccountnewLimit">Лимит счета (в
                        день)</label>
                    <div className="relative text-placeholder">
                        <Controller
                            name="chilAccountnewLimit"
                            control={control}
                            render={({field}) => (
                                <>
                                    <Input {...field} className="w-full pr-9" id="chilAccountnewLimit" type="number"
                                           placeholder="Например, 1 000₽"
                                           error={errors.chilAccountnewLimit?.message}
                                           large {...register("chilAccountnewLimit")}/>
                                    <Card className="absolute right-2 top-[0.5rem] w-5"/>
                                </>
                            )}
                        />

                    </div>
                </div>
                <div className="mb-2.5">
                    <AccentButton disabled={isPending} className="w-full justify-center" large>
                        Изменить лимит
                    </AccentButton>
                </div>
                <AnimatedLoader isLoading={isPending}/>
            </form>
        </div>
    </ModalWindow>
}