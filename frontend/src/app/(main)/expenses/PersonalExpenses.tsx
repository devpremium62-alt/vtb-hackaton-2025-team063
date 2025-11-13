import Heading from "@/shared/ui/typography/Heading";
import {TransactionCategoryType} from "@/entities/transaction-category";
import React from "react";
import 'dayjs/locale/ru';
import dayjs from "dayjs";
import Avatar from "@/shared/ui/Avatar";
import BalanceCounter from "@/shared/ui/MoneyCounting";
import ExpensesHistogram from "@/app/(main)/expenses/ExpensesHistogram";
import getAbsoluteSeverUrl from "@/shared/lib/getAbsoluteServerUrl";

type Props = {
    avatar: string;
    expenseCategories: TransactionCategoryType[];
}

const PersonalExpenses = ({avatar, expenseCategories}: Props) => {
    const totalExpenses = expenseCategories.reduce((acc, c) => acc + c.spent, 0);

    return <section className="mx-4 md:mx-0 md:ml-4 mb-[1.875rem] md:p-3 md:rounded-2xl md:bg-blue-50">
        <div className="flex items-center justify-between -mb-0.5">
            <Heading className="md:text-3xl lg:text-4xl" level={2}>Мои траты за {dayjs(Date.now()).locale('ru').format('MMMM')}</Heading>
            <Avatar avatar={getAbsoluteSeverUrl(avatar)}/>
        </div>
        <div className="mb-2.5">
            <p className="text-active text-[2rem] font-bold">
                <BalanceCounter value={totalExpenses}/>
            </p>
        </div>
        <ExpensesHistogram expenseCategories={expenseCategories}/>
    </section>;
}

export default PersonalExpenses;