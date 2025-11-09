export type Bank = {
    name: string;
    color: string;
}

export type BankKey = "alfa" | "sber" | "vtb" | "family";

export const banks: Record<BankKey, Bank> = {
    "alfa": {name: "Альфабанк", color: "#FF5A5F"},
    "sber": {name: "Сбербанк", color: "#00C897"},
    "vtb": {name: "ВТБ", color: "#0066FF"},
    "family": {name: "Family Bank", color: "#791EFF"}
};