import Limits from "@/app/(main)/expenses/Limits";
import SharedExpenses from "@/app/(main)/expenses/SharedExpenses";
import InteractiveTransactions from "@/app/(main)/expenses/InteractiveTransactions";
import {getLimits} from "@/entities/limit";
import {getTransactions} from "@/entities/transaction";
import {getFamily} from "@/entities/family";
import {getFamilyExpenses} from "@/entities/family/api/api";
import {ExpensesDistributionPortal} from "@/app/(main)/expenses/ExpensesDistributionPortal";
import promiseAllSafe from "@/shared/lib/promiseAllSafe";

export default async function Expenses() {
    const [
        limits,
        expenseCategories,
        family,
        transactions
    ] = await promiseAllSafe([getLimits(), getFamilyExpenses(), getFamily(), getTransactions()]);

    return <div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:gap-8 mb-20">
            <div className="md:order-2 flex flex-col items-stretch" id="right-column">
                <Limits className="mx-4 md:ml-0 md:order-2" limitsInitial={limits}/>
                <SharedExpenses className="ml-4 md:ml-0 md:mr-4 md:order-1"
                                expenseCategoriesInitial={expenseCategories} familyInitial={family}/>
            </div>
            <div className="md:order-1 flex flex-col items-stretch" id="left-column">
                <InteractiveTransactions transactionsInitial={transactions} familyInitial={family}
                                         familyExpenses={expenseCategories}/>
            </div>
            <ExpensesDistributionPortal familyInitial={family} expenseCategoriesInitial={expenseCategories}/>
        </div>
    </div>
}