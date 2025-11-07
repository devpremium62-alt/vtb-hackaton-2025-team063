import Heading from "@/shared/ui/typography/Heading";
import ModalWindow from "@/shared/ui/ModalWindow";
import {Dispatch, SetStateAction} from "react";
import {useForm} from "react-hook-form";
import Input from "@/shared/ui/inputs/Input";
import {Plus} from "@/shared/ui/icons/Plus";
import AccentButton from "@/shared/ui/AccentButton";
import Select from "@/shared/ui/inputs/Select";
import {Card} from "@/shared/ui/icons/Card";
import { yupResolver } from "@hookform/resolvers/yup"
import {schema} from "@/widgets/create-payment/model/schema";
import {ExpensesCategoriesOptions} from "@/entities/expense-category";
import DatePicker from "@/shared/ui/inputs/DatePicker";

type Props = {
    isActive: boolean;
    setActive: Dispatch<SetStateAction<boolean>>;
}

export const CreatePayment = ({isActive, setActive}: Props) => {
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data: unknown) => {
        console.log(data);
        setActive(false);
        reset();
    }

    function onDateChange(date: string | null) {
        setValue("paymentDate", new Date(date || Date.now()));
    }

    function onCategoryChange(category: string) {
        setValue("paymentCategory", category);
    }

    return <ModalWindow isActive={isActive} setActive={setActive}>
        <div className="mb-2.5">
            <Heading level={3}>Новый платеж</Heading>
        </div>
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="paymentName">Название платежа</label>
                    <Input id="paymentName" placeholder="На квартиру" error={errors.paymentName?.message} large {...register("paymentName")}/>
                </div>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="paymentValue">Сумма платежа</label>
                    <div className="relative text-placeholder">
                        <Input className="w-full pr-9" id="paymentValue" type="number" placeholder="Например, 7 000₽"
                               error={errors.paymentValue?.message} large {...register("paymentValue")}/>
                        <Card className="absolute right-2 top-[0.5rem] w-5"/>
                    </div>
                </div>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="paymentDate">Дата платежа</label>
                    <DatePicker dateChange={onDateChange} large error={errors.paymentDate?.message}/>
                </div>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="paymentCategory">Категория</label>
                    <Select error={errors.paymentCategory?.message} onChange={onCategoryChange} large placeholder="Выберите категорию" id="paymentCategory"
                            options={ExpensesCategoriesOptions}/>
                </div>
                <div className="mb-2.5">
                    <AccentButton className="w-full justify-center" large>
                        <Plus className="mr-1"/>
                        Добавить
                    </AccentButton>
                </div>
            </form>
        </div>
    </ModalWindow>
}