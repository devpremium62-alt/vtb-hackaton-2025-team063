import SharedBalance from "@/app/(main)/dashboard/SharedBalance";
import Accounts from "@/app/(main)/dashboard/Accounts";
import ShortGoals from "@/app/(main)/dashboard/ShortGoals";
import ShortUpcomingPayments from "@/app/(main)/dashboard/ShortUpcomingPayments";
import fetchWrap from "@/shared/lib/fetchWrap";
import {ChildAccountSimple} from "@/entities/child-account";
import {GoalType} from "@/entities/goal";
import {PaymentType} from "@/entities/payment";

export default async function Dashboard() {
    const members = await fetchWrap("/api/users/family");
    const sharedAccounts = await fetchWrap("/api/accounts");
    const payments = (await fetchWrap("/api/payments")).map((p: PaymentType) => ({...p, date: new Date(p.date)}));
    const goals = (await fetchWrap("/api/goals")).map((p: GoalType) => ({...p, deadline: new Date(p.deadline)}));
    const childAccount = await fetchWrap("/api/accounts/child");

    return <div>
        <SharedBalance personFirst={members[0]}
                       personSecond={members[1]} balance={sharedAccounts.balance}
                       monthlyIncome={sharedAccounts.monthlyIncome}/>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
            <div>
                <Accounts firstAccount={members[0]} secondAccount={members[0]}/>
                <ShortUpcomingPayments payments={payments}/>
            </div>
            <div>
                <ShortGoals goals={goals}/>
                <ChildAccountSimple account={childAccount}/>
            </div>
        </div>
    </div>
}