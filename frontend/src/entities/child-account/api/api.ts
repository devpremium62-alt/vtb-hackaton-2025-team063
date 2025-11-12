import {fetchMock} from "@/shared/lib/fetchMock";
import {ChildAccountType} from "@/entities/child-account";
import universalFetch from "@/shared/lib/universalFetch";

export async function getChildAccounts(): Promise<ChildAccountType[]> {
    return universalFetch("/child-accounts");
}

export async function createChildAccount(childAccount: FormData) {
    return universalFetch("/child-accounts", {
        method: "POST",
        body: childAccount,
    });
}

export async function deleteChildAccount(childAccountId: string) {
    return universalFetch(`/child-accounts/${childAccountId}`, {
        method: "DELETE",
    });
}

export async function changeLimit({moneyPerDay, accountId}: {
    accountId: string,
    moneyPerDay: number
}): Promise<ChildAccountType> {
    return universalFetch(`/child-accounts/${accountId}`, {
        method: "PATCH",
        body: {moneyPerDay},
    });
}

export async function depositMoney(amount: number): Promise<ChildAccountType> {
    return fetchMock("/api/accounts/child/sum", {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({amount}),
    });
}