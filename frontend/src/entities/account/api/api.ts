import fetchWrap from "@/shared/lib/fetchWrap";
import {PersonalAccountType, SharedAccountType} from "@/entities/account/model/types";

export async function getSharedAccounts(): Promise<SharedAccountType> {
    return fetchWrap("/api/accounts");
}

export async function getPersonalAccounts(): Promise<Record<number, PersonalAccountType>> {
    return fetchWrap("/api/users/family");
}