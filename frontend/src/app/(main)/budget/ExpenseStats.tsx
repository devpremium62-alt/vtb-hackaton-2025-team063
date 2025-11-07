import Heading from "@/shared/ui/typography/Heading";
import {Expenses as ExpensesBlock} from "@/widgets/expenses";
import {ExpenseCategoryType} from "@/entities/expense-category";

type Props = {
    expenseCategories: ExpenseCategoryType[];
}

const ExpenseStats = ({expenseCategories}: Props) => {
    return <section className="ml-4 md:ml-0 mb-[1.875rem]">
        <div className="mb-2.5">
            <Heading level={2}>Статистика расходов</Heading>
        </div>
        <ExpensesBlock expenseCategories={expenseCategories}/>
    </section>
}

export default ExpenseStats;