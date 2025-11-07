type Bank = {
    name: string;
    color: string;
}

export const banks: Record<string, Bank> = {
    "alfa": {name: "Альфабанк", color: "#FF5A5F"},
    "sber": {name: "Сбербанк", color: "#00C897"},
    "vtb": {name: "ВТБ", color: "#0066FF"},
    "family": {name: "Family Bank", color: "#791EFF"}
};