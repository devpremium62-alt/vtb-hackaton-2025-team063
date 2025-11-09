"use client";

import Heading from "@/shared/ui/typography/Heading";
import {Expenses as ExpensesBlock} from "@/widgets/expenses";
import {useQuery} from "@tanstack/react-query";
import {getExpenseCategories} from "@/entities/expense-category";

const ExpenseStats = () => {
    const {data: expenseCategories = []} = useQuery({
        queryKey: ["expense-categories"],
        queryFn: getExpenseCategories,
        refetchInterval: 5000
    });

    return <section className="ml-4 md:ml-0 mb-[1.875rem]">
        <div className="mb-2.5">
            <Heading level={2}>Статистика расходов</Heading>
        </div>
        <ExpensesBlock expenseCategories={expenseCategories}/>
    </section>
}

export default ExpenseStats;