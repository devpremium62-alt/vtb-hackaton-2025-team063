import SharedBalance from "@/app/(main)/dashboard/SharedBalance";
import Accounts from "@/app/(main)/dashboard/Accounts";
import ShortGoals from "@/app/(main)/dashboard/ShortGoals";
import ShortUpcomingPayments from "@/app/(main)/dashboard/ShortUpcomingPayments";
import {getChildAccounts} from "@/entities/child-account";
import {getGoals} from "@/entities/goal";
import {getPayments} from "@/entities/payment";
import {getFamilyFinance} from "@/entities/family/api/api";
import {ShortChildAccounts} from "@/app/(main)/dashboard/ShortChildAccounts";
import promiseAllSafe from "@/shared/lib/promiseAllSafe";

export default async function Dashboard() {
    const [
        familyFinance,
        payments,
        goals,
        childAccounts
    ] = await promiseAllSafe([getFamilyFinance(), getPayments(), getGoals(), getChildAccounts()]);

    return <div className="mb-24">
        <SharedBalance familyFinanceInitial={familyFinance}/>
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-1 lg:gap-2">
            <Accounts className="mx-4 md:col-span-12" familyFinanceInitial={familyFinance}/>
            <ShortUpcomingPayments className="mx-4 md:mr-0 md:col-span-6 lg:col-span-7" paymentsInitial={payments}/>
            <div className="md:col-span-6 lg:col-span-5">
                <ShortGoals className="mx-4 md:mx-0 md:mr-4" goalsInitial={goals}/>
                <ShortChildAccounts className="mx-4 md:ml-0" childAccountsInitial={childAccounts}/>
            </div>
        </div>
    </div>
}