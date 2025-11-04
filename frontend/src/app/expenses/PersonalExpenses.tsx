import Heading from "@/shared/ui/typography/Heading";
import {ExpenseCategory, ExpenseCategoryType} from "@/entities/expense-category";
import React from "react";
import 'dayjs/locale/ru';
import dayjs from "dayjs";
import Avatar from "@/shared/ui/Avatar";
import Histogram from "@/shared/ui/charts/Histogram";
import BalanceCounter from "@/shared/ui/MoneyCounting";

type Props = {
    avatar: string;
    expenseCategories: ExpenseCategoryType[];
}

const PersonalExpenses = ({avatar, expenseCategories}: Props) => {
    const histogramData = expenseCategories.map(cat => ({value: cat.spent, color: cat.color}));
    const totalExpenses = expenseCategories.reduce((acc, c) => acc + c.spent, 0);

    return <section className="mx-4 md:mx-0 md:mr-4 mb-5">
        <div className="flex items-center justify-between -mb-1.5">
            <Heading level={2}>Мои траты за {dayjs(Date.now()).locale('ru').format('MMMM')}</Heading>
            <Avatar avatar={avatar}/>
        </div>
        <div className="mb-2.5">
            <p className="text-active text-[2rem] font-bold">
                <BalanceCounter value={totalExpenses}/>
            </p>
        </div>
        <div className="mb-2.5">
            <Histogram data={histogramData}/>
        </div>
        <div className="flex items-center justify-start gap-1 mb-32 flex-wrap">
            {expenseCategories.map(cat => (
                <ExpenseCategory key={cat.name} overflowText={false} expenseCategory={cat}/>
            ))}
        </div>
    </section>;
}

export default PersonalExpenses;