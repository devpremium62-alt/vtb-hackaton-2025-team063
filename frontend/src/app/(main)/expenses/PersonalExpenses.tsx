import Heading from "@/shared/ui/typography/Heading";
import {ExpenseCategoryType} from "@/entities/expense-category";
import React from "react";
import 'dayjs/locale/ru';
import dayjs from "dayjs";
import Avatar from "@/shared/ui/Avatar";
import BalanceCounter from "@/shared/ui/MoneyCounting";
import ExpensesHistogram from "@/app/(main)/expenses/ExpensesHistogram";

type Props = {
    avatar: string;
    expenseCategories: ExpenseCategoryType[];
}

const PersonalExpenses = ({avatar, expenseCategories}: Props) => {
    const totalExpenses = expenseCategories.reduce((acc, c) => acc + c.spent, 0);

    return <section className="mx-4 md:mx-0 md:mr-4 mb-[1.875rem]">
        <div className="flex items-center justify-between -mb-1.5">
            <Heading level={2}>Мои траты за {dayjs(Date.now()).locale('ru').format('MMMM')}</Heading>
            <Avatar avatar={avatar}/>
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