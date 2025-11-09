import Limits from "@/app/(main)/expenses/Limits";
import SharedExpenses from "@/app/(main)/expenses/SharedExpenses";
import ExpensesDistribution from "@/app/(main)/expenses/ExpensesDistribution";
import InteractiveExpenses from "@/app/(main)/expenses/InteractiveExpenses";
import { fetchMock } from "@/shared/lib/fetchMock";
import {getExpenses} from "@/entities/expense";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {getExpenseCategories} from "@/entities/expense-category";
import {getLimits} from "@/entities/limit";

export default async function Expenses() {
    const members = await fetchMock("/api/users/family");

    const queryClient = new QueryClient();

    await Promise.all([
        queryClient.prefetchQuery({queryKey: ["expenses"], queryFn: getExpenses}),
        queryClient.prefetchQuery({queryKey: ["expense-categories"], queryFn: getExpenseCategories}),
        queryClient.prefetchQuery({queryKey: ["limits"], queryFn: getLimits}),
    ]);

    return <div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
            <div>
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <Limits/>
                    <SharedExpenses firstAvatar={members[1].avatar} secondAvatar={members[2].avatar}/>
                </HydrationBoundary>
            </div>
            <div>
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <InteractiveExpenses avatar={members[1].avatar}/>
                </HydrationBoundary>
                <ExpensesDistribution firstPerson={members[1]} secondPerson={members[2]}/>
            </div>
        </div>
    </div>
}