import fetchWrap from "@/shared/lib/fetchWrap";
import {WalletType} from "@/entities/wallet";

export async function getWallets(): Promise<WalletType[]> {
    return fetchWrap("/api/accounts/wallets");
}

export async function addWallet(newWallet: Omit<WalletType, "id" | "category" | "money"> & {category: number}): Promise<WalletType> {
    return fetchWrap("/api/accounts/wallets", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(newWallet),
    });
}

export async function deleteWallet(walletId: number): Promise<void> {
    await fetchWrap(`/api/accounts/wallets/?id=${walletId}`, {
        method: "DELETE",
    });
}