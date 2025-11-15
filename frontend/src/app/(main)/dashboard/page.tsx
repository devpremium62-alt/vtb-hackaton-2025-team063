import SharedBalance from "@/app/(main)/dashboard/SharedBalance";
import Accounts from "@/app/(main)/dashboard/Accounts";
import ShortGoals from "@/app/(main)/dashboard/ShortGoals";
import ShortUpcomingPayments from "@/app/(main)/dashboard/ShortUpcomingPayments";
import {getChildAccounts} from "@/entities/child-account";
import {getGoals} from "@/entities/goal";
import {getPayments} from "@/entities/payment";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {getFamilyFinance} from "@/entities/family/api/api";
import {ShortChildAccounts} from "@/app/(main)/dashboard/ShortChildAccounts";

export default async function Dashboard() {
    const queryClient = new QueryClient();

    await Promise.all([
        queryClient.prefetchQuery({queryKey: ["family-finance"], queryFn: getFamilyFinance}),
        queryClient.prefetchQuery({queryKey: ["goals"], queryFn: getGoals}),
        queryClient.prefetchQuery({queryKey: ["payments"], queryFn: getPayments}),
        queryClient.prefetchQuery({queryKey: ["child-accounts"], queryFn: getChildAccounts})
    ]);


    return <div className="mb-24">
        <HydrationBoundary state={dehydrate(queryClient)}>
            <SharedBalance/>
        </HydrationBoundary>
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-1 lg:gap-2">
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Accounts className="mx-4 md:col-span-12"/>
                <ShortUpcomingPayments className="mx-4 md:mr-0 md:col-span-6 lg:col-span-7"/>
                <div className="md:col-span-6 lg:col-span-5">
                    <ShortGoals className="mx-4 md:mx-0 md:mr-4"/>
                    <ShortChildAccounts className="mx-4 md:ml-0"/>
                </div>
            </HydrationBoundary>
        </div>
    </div>
}