import fetchWrap from "@/shared/lib/fetchWrap";
import {ChildAccountType} from "@/entities/child-account";

export async function getChildAccount(): Promise<ChildAccountType> {
    return fetchWrap("/api/accounts/child");
}

export async function changeLimit(limit: number): Promise<ChildAccountType> {
    return fetchWrap("/api/accounts/child", {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({limit}),
    });
}

export async function depositMoney(amount: number): Promise<ChildAccountType> {
    return fetchWrap("/api/accounts/child/sum", {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({amount}),
    });
}