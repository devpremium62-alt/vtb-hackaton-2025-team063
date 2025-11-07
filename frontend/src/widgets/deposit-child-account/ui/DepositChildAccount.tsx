import Heading from "@/shared/ui/typography/Heading";
import ModalWindow from "@/shared/ui/ModalWindow";
import {Dispatch, SetStateAction} from "react";
import {useForm} from "react-hook-form";
import Input from "@/shared/ui/inputs/Input";
import {Plus} from "@/shared/ui/icons/Plus";
import AccentButton from "@/shared/ui/AccentButton";
import {Card} from "@/shared/ui/icons/Card";
import {yupResolver} from "@hookform/resolvers/yup"
import {schema} from "@/widgets/deposit-child-account/model/schema";

type Props = {
    isActive: boolean;
    setActive: Dispatch<SetStateAction<boolean>>;
}

export const DepositChildAccount = ({isActive, setActive}: Props) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data: unknown) => {
        console.log(data);
        setActive(false);
        reset();
    }

    return <ModalWindow isActive={isActive} setActive={setActive}>
        <div className="mb-2.5">
            <Heading level={3}>Пополнить детский счет</Heading>
        </div>
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="chilAccountnewAdd">Желаемая сумма</label>
                    <div className="relative text-placeholder">
                        <Input className="w-full pr-9" id="chilAccountnewAdd" type="number" placeholder="Например, 10 000₽"
                               error={errors.chilAccountnewAdd?.message} large {...register("chilAccountnewAdd")}/>
                        <Card className="absolute right-2 top-[0.5rem] w-5"/>
                    </div>
                </div>
                <div className="mb-2.5">
                    <AccentButton className="w-full justify-center" large>
                        <Plus className="mr-1"/>
                        Пополнить
                    </AccentButton>
                </div>
            </form>
        </div>
    </ModalWindow>
}