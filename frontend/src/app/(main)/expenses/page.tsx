import Limits from "@/app/(main)/expenses/Limits";
import SharedExpenses from "@/app/(main)/expenses/SharedExpenses";
import ExpensesDistribution from "@/app/(main)/expenses/ExpensesDistribution";
import InteractiveExpenses from "@/app/(main)/expenses/InteractiveExpenses";
import fetchWrap from "@/shared/lib/fetchWrap";
import {ExpenseType} from "@/entities/expense";

export default async function Expenses() {
    const members = await fetchWrap("/api/users/family");
    const expensesByCategories = await fetchWrap("/api/expenses/categories");
    const limits = await fetchWrap("/api/expenses/limits");
    const expenses = (await fetchWrap("/api/expenses")).map((e:ExpenseType) => ({...e, date: new Date(e.date)}));

    return <div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
            <div>
                <Limits limits={limits}/>
                <SharedExpenses firstAvatar={members[0].avatar} secondAvatar={members[1].avatar}
                                expenseCategories={expensesByCategories}/>
            </div>
            <div>
                <InteractiveExpenses avatar={members[0].avatar} categories={expensesByCategories} expenses={expenses}/>
                <ExpensesDistribution firstPerson={members[0]} secondPerson={members[1]}/>
            </div>
        </div>
    </div>
}