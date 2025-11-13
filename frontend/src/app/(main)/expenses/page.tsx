import Limits from "@/app/(main)/expenses/Limits";
import SharedExpenses from "@/app/(main)/expenses/SharedExpenses";
import InteractiveTransactions from "@/app/(main)/expenses/InteractiveTransactions";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {getLimits} from "@/entities/limit";
import {getTransactions} from "@/entities/transaction";
import {getFamily} from "@/entities/family";
import {getFamilyExpenses} from "@/entities/family/api/api";
import {ExpensesDistributionPortal} from "@/app/(main)/expenses/ExpensesDistributionPortal";

export default async function Expenses() {
    const members = await getFamily();

    const queryClient = new QueryClient();

    await Promise.all([
        queryClient.prefetchQuery({queryKey: ["family-expenses"], queryFn: getFamilyExpenses}),
        queryClient.prefetchQuery({queryKey: ["transactions"], queryFn: getTransactions}),
        queryClient.prefetchQuery({queryKey: ["limits"], queryFn: getLimits}),
    ]);

    return <div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:gap-8 mb-20">
            <div className="md:order-2 flex flex-col items-stretch" id="right-column">
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <Limits className="mx-4 md:mx-0 md:order-2"/>
                    <SharedExpenses className="ml-4 md:ml-0 md:order-1" firstAvatar={members[0].avatar}
                                    secondAvatar={members[1].avatar}/>
                </HydrationBoundary>
            </div>
            <div className="md:order-1 flex flex-col items-stretch" id="left-column">
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <InteractiveTransactions avatar={members[0].avatar}/>
                </HydrationBoundary>
            </div>
            <ExpensesDistributionPortal  firstAvatar={members[0].avatar} secondAvatar={members[1].avatar}/>
        </div>
    </div>
}