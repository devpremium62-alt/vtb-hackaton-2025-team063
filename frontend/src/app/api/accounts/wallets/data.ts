import {WalletType} from "@/entities/wallet";
import {getExpenseCategories} from "@/app/api/expenses/categories/data";

let wallets: (Omit<WalletType, "category"> & {category: number})[] = [
    {id: 1, name: "Развелечения", bank: "alfa", period:"week", category: 1, money: 10000, limit: 20000},
    {id: 2, name: "Продукты", bank: "sber", period:"week", category: 2, money: 0, limit: 40000},
    {id: 3, name: "ЖКХ и связь", bank: "alfa", period:"week", category: 3, money: 4500, limit: 5000},
];

export function getWallets() {
    const categories = getExpenseCategories();
    return wallets.map(w => ({...w, category: categories.find((c) => c.id === w.category)}));
}

export function addWallet(wallet: Omit<WalletType, "id" | "category"> & {category: number}) {
    const newWallet = {
        ...wallet,
        id: Math.max(0, ...wallets.map((g) => g.id)) + 1,
        money: 0,
    };

    wallets.push(newWallet);
    return wallet;
}

export function deleteWallet(walletId: number) {
    wallets = wallets.filter((wallet) => wallet.id !== walletId);
}
