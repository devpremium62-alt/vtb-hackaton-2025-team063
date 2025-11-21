import Goals from "@/app/(main)/budget/Goals";
import Wallets from "@/app/(main)/budget/Wallets";
import UpcomingPayments from "@/app/(main)/budget/UpcomingPayments";
import ChildExpenseStats from "@/app/(main)/budget/ChildExpenseStats";
import {getChildAccounts} from "@/entities/child-account";
import {getChildTransactions} from "@/entities/transaction";
import {getPayments} from "@/entities/payment";
import {getGoals} from "@/entities/goal";
import {getWallets} from "@/entities/wallet";
import {ChildAccounts} from "@/app/(main)/budget/ChildAccounts";
import ChildTransactionList from "@/app/(main)/budget/ChildTransactionsList";
import {getChildTransactionCategories} from "@/entities/transaction/api/api";
import promiseAllSafe from "@/shared/lib/promiseAllSafe";

export default async function Budget() {
    const [
        goals,
        wallets,
        payments,
        childAccounts,
        childTransactions,
        childTransactionCategories,
    ] = await promiseAllSafe([getGoals(), getWallets(), getPayments(), getChildAccounts(), getChildTransactions(), getChildTransactionCategories()]);

    return <div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:gap-8 mb-20">
            <div className="flex flex-col items-stretch">
                <Goals className="mx-4 md:mr-0 md:order-3" goalsInitial={goals}/>
                <Wallets className="mx-4 md:mr-0 md:order-2" walletsInitial={wallets}/>
                <UpcomingPayments className="mx-4 md:mr-0 md:order-1" paymentsInitial={payments}/>
            </div>
            <div className="flex flex-col items-stretch">
                <ChildAccounts className="mx-4 md:ml-0 md:order-3" childAccountsInitial={childAccounts}/>
                <ChildExpenseStats className="ml-4 md:ml-0 md:mr-4 md:order-1" childTransactionCategoriesInitial={childTransactionCategories}/>
                <ChildTransactionList className="mx-4 md:ml-0 md:order-2" childTransactionsInitial={childTransactions}/>
            </div>
        </div>
    </div>
}