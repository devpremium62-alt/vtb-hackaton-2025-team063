import Heading from "@/shared/ui/typography/Heading";
import ModalWindow from "@/shared/ui/ModalWindow";
import {Dispatch, SetStateAction} from "react";
import {useForm} from "react-hook-form";
import Input from "@/shared/ui/inputs/Input";
import AccentButton from "@/shared/ui/AccentButton";
import {Card} from "@/shared/ui/icons/Card";
import {yupResolver} from "@hookform/resolvers/yup"
import {schema} from "@/widgets/change-child-account-limit/model/schema";

type Props = {
    isActive: boolean;
    setActive: Dispatch<SetStateAction<boolean>>;
}

export const ChangeChildAccountLimit = ({isActive, setActive}: Props) => {
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
            <Heading level={3}>Изменить лимит счета</Heading>
        </div>
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="chilAccountnewLimit">Лимит счета (в день)</label>
                    <div className="relative text-placeholder">
                        <Input className="w-full pr-9" id="chilAccountnewLimit" type="number" placeholder="Например, 1 000₽"
                               error={errors.chilAccountnewLimit?.message} large {...register("chilAccountnewLimit")}/>
                        <Card className="absolute right-2 top-[0.5rem] w-5"/>
                    </div>
                </div>
                <div className="mb-2.5">
                    <AccentButton className="w-full justify-center" large>
                        Изменить лимит
                    </AccentButton>
                </div>
            </form>
        </div>
    </ModalWindow>
}