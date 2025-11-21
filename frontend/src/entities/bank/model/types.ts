export type Bank = {
    name: string;
    color: string;
    iconBg: string;
}

export type BankKey = "abank" | "sbank" | "vbank";

export const banks: Record<BankKey, Bank> = {
    "abank": {
        name: "Awesome Bank",
        color: "#FF5A5F",
        iconBg: "linear-gradient(135deg, #ff5ea8, #ff4088)"
    },
    "sbank": {
        name: "Smart Bank",
        color: "#00C897",
        iconBg: "linear-gradient(135deg, #21e1b3, #1ec99b)",
    },
    "vbank": {
        name: "Virtual Bank",
        color: "#0066FF",
        iconBg: "linear-gradient(135deg, #7aa2ff, #5e8aff)"
    }
};

export type Consent = {
    bankId: string;
    clientId: string;
    status: "active" | "pending";
}