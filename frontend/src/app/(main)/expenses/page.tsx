import Limits from "@/app/(main)/expenses/Limits";
import SharedExpenses from "@/app/(main)/expenses/SharedExpenses";
import ExpensesDistribution from "@/app/(main)/expenses/ExpensesDistribution";
import InteractiveExpenses from "@/app/(main)/expenses/InteractiveExpenses";
import fetchWrap from "@/shared/lib/fetchWrap";
import {getExpenses} from "@/entities/expense";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {getExpenseCategories} from "@/entities/expense-category";

export default async function Expenses() {
    const members = await fetchWrap("/api/users/family");
    const limits = await fetchWrap("/api/expenses/limits");

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["expenses"],
        queryFn: getExpenses,
    });

    await queryClient.prefetchQuery({
        queryKey: ["expense-categories"],
        queryFn: getExpenseCategories,
    });

    return <div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
            <div>
                <Limits limits={limits}/>
                <HydrationBoundary state={dehydrate(queryClient)}>
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