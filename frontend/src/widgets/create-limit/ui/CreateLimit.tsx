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
import {ExpensesCategoriesOptions} from "@/entities/expense-category";
import {schema} from "@/widgets/create-limit/model/schema";

type Props = {
    isActive: boolean;
    setActive: Dispatch<SetStateAction<boolean>>;
}

export const CreateLimit = ({isActive, setActive}: Props) => {
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

    function onCategoryChange(category: string) {
        setValue("limitCategory", category);
    }

    return <ModalWindow isActive={isActive} setActive={setActive}>
        <div className="mb-2.5">
            <Heading level={3}>Новый лимит</Heading>
        </div>
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="limitName">Название лимита</label>
                    <Input id="limitName" placeholder="Продукты" error={errors.limitName?.message}
                           large {...register("limitName")}/>
                </div>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="walletLimit">Лимит</label>
                    <div className="relative text-placeholder">
                        <Input className="w-full pr-9" id="limitValue" type="number" placeholder="Например, 100 000₽"
                               error={errors.limitValue?.message} large {...register("limitValue")}/>
                        <Card className="absolute right-2 top-[0.5rem] w-5"/>
                    </div>
                </div>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="limitCategory">Категория</label>
                    <Select error={errors.limitCategory?.message} onChange={onCategoryChange} large
                            placeholder="Выберите категорию" id="limitCategory"
                            options={ExpensesCategoriesOptions}/>
                </div>
                <div className="mb-2.5">
                    <AccentButton className="w-full justify-center" large>
                        <Plus className="mr-1"/>
                        Создать лимит
                    </AccentButton>
                </div>
            </form>
        </div>
    </ModalWindow>
}