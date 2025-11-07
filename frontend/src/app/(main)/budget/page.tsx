import Goals from "@/app/(main)/budget/Goals";
import Wallet from "@/app/(main)/budget/Wallet";
import UpcomingPayments from "@/app/(main)/budget/UpcomingPayments";
import ExpenseStats from "@/app/(main)/budget/ExpenseStats";
import ExpenseList from "@/app/(main)/budget/ExpenseList";
import {ChildAccountExtended} from "@/entities/child-account";
import fetchWrap from "@/shared/lib/fetchWrap";
import {ExpenseType} from "@/entities/expense";
import {PaymentType} from "@/entities/payment";
import {GoalType} from "@/entities/goal";

export default async function Budget() {
    const childAccount = await fetchWrap("/api/accounts/child");
    const expensesByCategories = await fetchWrap("/api/expenses/categories");
    const wallets = await fetchWrap("/api/accounts/wallets");
    const payments = (await fetchWrap("/api/payments")).map((p: PaymentType) => ({...p, date: new Date(p.date)}));
    const goals = (await fetchWrap("/api/goals")).map((p: GoalType) => ({...p, deadline: new Date(p.deadline)}));
    const expenses = (await fetchWrap("/api/expenses")).map((e:ExpenseType) => ({...e, date: new Date(e.date)}));

    return <div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
            <div>
                <Goals goals={goals}/>
                <Wallet walletItems={wallets}/>
                <UpcomingPayments payments={payments}/>
            </div>
            <div>
                <ChildAccountExtended account={childAccount}/>
                <ExpenseStats expenseCategories={expensesByCategories}/>
                <ExpenseList expenses={expenses}/>
            </div>
        </div>
    </div>
}