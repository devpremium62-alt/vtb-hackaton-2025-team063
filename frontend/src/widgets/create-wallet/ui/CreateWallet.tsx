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
import {schema} from "@/widgets/create-wallet/model/schema";
import {ExpensesCategoriesOptions} from "@/entities/expense-category";

type Props = {
    isActive: boolean;
    setActive: Dispatch<SetStateAction<boolean>>;
}

export const CreateWallet = ({isActive, setActive}: Props) => {
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

    function onPeriodChange(period: string) {
        setValue("walletPeriod", period);
    }

    function onCategoryChange(category: string) {
        setValue("walletCategory", category);
    }

    function onBankChange(bank: string) {
        setValue("walletBank", bank);
    }

    return <ModalWindow isActive={isActive} setActive={setActive}>
        <div className="mb-2.5">
            <Heading level={3}>Новый кошелёк</Heading>
        </div>
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="walletName">Название кошелька</label>
                    <Input id="walletName" placeholder="Продукты" error={errors.walletName?.message}
                           large {...register("walletName")}/>
                </div>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="walletLimit">Лимит</label>
                    <div className="relative text-placeholder">
                        <Input className="w-full pr-9" id="walletLimit" type="number" placeholder="Например, 100 000₽"
                               error={errors.walletLimit?.message} large {...register("walletLimit")}/>
                        <Card className="absolute right-2 top-[0.5rem] w-5"/>
                    </div>
                </div>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="paymentCategory">Категория</label>
                    <Select error={errors.walletCategory?.message} onChange={onCategoryChange} large
                            placeholder="Выберите категорию" id="paymentCategory"
                            options={ExpensesCategoriesOptions}/>
                </div>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="walletPeriod">Период</label>
                    <Select error={errors.walletPeriod?.message} onChange={onPeriodChange} large
                            placeholder="Выберите период" id="walletPeriod"
                            options={[{value: "week", label: "Неделя"}, {value: "month", label: "Месяц"}]}/>
                </div>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="walletBank">Банк</label>
                    <Select error={errors.walletBank?.message} onChange={onBankChange} large placeholder="Выберите банк"
                            id="walletBank"
                            options={[{value: "vbank", label: "Virtual Bank"}, {
                                value: "abank",
                                label: "Awesome Bank"
                            }, {value: "sbank", label: "Smart Bank"}]}/>
                </div>
                <div className="mb-2.5">
                    <AccentButton className="w-full justify-center" large>
                        <Plus className="mr-1"/>
                        Создать кошелек
                    </AccentButton>
                </div>
            </form>
        </div>
    </ModalWindow>
}