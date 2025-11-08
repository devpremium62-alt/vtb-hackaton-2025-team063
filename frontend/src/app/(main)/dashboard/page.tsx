import SharedBalance from "@/app/(main)/dashboard/SharedBalance";
import Accounts from "@/app/(main)/dashboard/Accounts";
import ShortGoals from "@/app/(main)/dashboard/ShortGoals";
import ShortUpcomingPayments from "@/app/(main)/dashboard/ShortUpcomingPayments";
import {ChildAccountSimple, getChildAccount} from "@/entities/child-account";
import {getGoals} from "@/entities/goal";
import {getPayments} from "@/entities/payment";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {getPersonalAccounts, getSharedAccounts} from "@/entities/account";

export default async function Dashboard() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["shared-accounts"],
        queryFn: getSharedAccounts,
    });

    await queryClient.prefetchQuery({
        queryKey: ["personal-accounts"],
        queryFn: getPersonalAccounts,
    });

    await queryClient.prefetchQuery({
        queryKey: ["goals"],
        queryFn: getGoals,
    });

    await queryClient.prefetchQuery({
        queryKey: ["payments"],
        queryFn: getPayments,
    });

    await queryClient.prefetchQuery({
        queryKey: ["child-account"],
        queryFn: getChildAccount,
    });

    return <div>
        <HydrationBoundary state={dehydrate(queryClient)}>
            <SharedBalance/>
        </HydrationBoundary>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
            <div>
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <Accounts/>
                    <ShortUpcomingPayments/>
                </HydrationBoundary>
            </div>
            <div>
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <ShortGoals/>
                    <ChildAccountSimple/>
                </HydrationBoundary>
            </div>
        </div>
    </div>
}