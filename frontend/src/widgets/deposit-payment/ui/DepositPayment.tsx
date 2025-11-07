import Heading from "@/shared/ui/typography/Heading";
import ModalWindow from "@/shared/ui/ModalWindow";
import {Dispatch, SetStateAction} from "react";
import {useForm} from "react-hook-form";
import AccentButton from "@/shared/ui/AccentButton";

type Props = {
    isActive: boolean;
    setActive: Dispatch<SetStateAction<boolean>>;
}

export const DepositPayment = ({isActive, setActive}: Props) => {
    const {
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm();

    const onSubmit = (data: unknown) => {
        console.log(data);
        setActive(false);
        reset();
    }

    return <ModalWindow isActive={isActive} setActive={setActive}>
        <div className="mb-2.5">
            <Heading level={3}>Выполнить платеж</Heading>
        </div>
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-2.5">
                    <AccentButton className="w-full justify-center" large>
                        Заплатить
                    </AccentButton>
                </div>
            </form>
        </div>
    </ModalWindow>
}