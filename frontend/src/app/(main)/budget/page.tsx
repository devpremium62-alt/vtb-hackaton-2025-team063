import Goals from "@/app/(main)/budget/Goals";
import Wallets from "@/app/(main)/budget/Wallets";
import UpcomingPayments from "@/app/(main)/budget/UpcomingPayments";
import ExpenseStats from "@/app/(main)/budget/ExpenseStats";
import ExpenseList from "@/app/(main)/budget/ExpenseList";
import {ChildAccountExtended} from "@/entities/child-account";
import {getExpenses} from "@/entities/expense";
import {getPayments} from "@/entities/payment";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {getGoals} from "@/entities/goal";
import {getWallets} from "@/entities/wallet";
import {getExpenseCategories} from "@/entities/expense-category";

export default async function Budget() {
    const queryClient = new QueryClient();

    await Promise.all([
        queryClient.prefetchQuery({queryKey: ["goals"], queryFn: getGoals}),
        queryClient.prefetchQuery({queryKey: ["expense-categories"], queryFn: getExpenseCategories}),
        queryClient.prefetchQuery({queryKey: ["expenses"], queryFn: getExpenses}),
        queryClient.prefetchQuery({queryKey: ["wallets"], queryFn: getWallets}),
        queryClient.prefetchQuery({queryKey: ["payments"],queryFn: getPayments})
    ]);

    return <div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
            <div>
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <Goals/>
                    <Wallets/>
                    <UpcomingPayments/>
                </HydrationBoundary>
            </div>
            <div>
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <ChildAccountExtended/>
                    <ExpenseStats/>
                    <ExpenseList/>
                </HydrationBoundary>
            </div>
        </div>
    </div>
}