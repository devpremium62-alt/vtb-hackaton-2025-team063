import SharedBalance from "@/app/(main)/dashboard/SharedBalance";
import Accounts from "@/app/(main)/dashboard/Accounts";
import ShortGoals from "@/app/(main)/dashboard/ShortGoals";
import ShortUpcomingPayments from "@/app/(main)/dashboard/ShortUpcomingPayments";
import fetchWrap from "@/shared/lib/fetchWrap";
import {ChildAccountSimple} from "@/entities/child-account";
import {getGoals} from "@/entities/goal";
import {PaymentType} from "@/entities/payment";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";

export default async function Dashboard() {
    const members = await fetchWrap("/api/users/family");
    const sharedAccounts = await fetchWrap("/api/accounts");
    const payments = (await fetchWrap("/api/payments")).map((p: PaymentType) => ({...p, date: new Date(p.date)}));
    const childAccount = await fetchWrap("/api/accounts/child");

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["goals"],
        queryFn: getGoals,
    });

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
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <ShortGoals/>
                </HydrationBoundary>
                <ChildAccountSimple account={childAccount}/>
            </div>
        </div>
    </div>
}