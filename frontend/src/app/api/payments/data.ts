import {PaymentType} from "@/entities/payment";
import {getExpenseCategories} from "@/app/api/expenses/categories/data";

let payments: (Omit<PaymentType, "category"> & {category: number})[] = [
    {
        id: 1,
        category: 3,
        date: new Date(2025, 10, 3),
        money: 5000,
        name: "На квартиру",
        payed: true
    },
    {
        id: 2,
        category: 9,
        date: new Date(2025, 10, 2),
        money: 4500,
        name: "Детский счет",
        payed: false
    },
    {
        id: 3,
        category: 7,
        date: new Date(2025, 10, 10),
        name: "Подписка",
        money: 500,
        payed: false
    },
    {
        id: 4,
        category: 9,
        date: new Date(2025, 10, 20),
        name: "Кредит",
        money: 10000,
        payed: false
    }
];

export function getPayments() {
    const categories = getExpenseCategories();
    return payments
        .sort((p1, p2) => new Date(p1.date).getTime() - new Date(p2.date).getTime())
        .map(p => ({...p, category: categories.find((c) => c.id === p.category)}));
}

export function addPayment(payment: Omit<PaymentType, "id"  | "category"> & {category: number}) {
    const newPayment = {
        ...payment,
        id: Math.max(0, ...payments.map((p) => p.id)) + 1,
        payed: false,
    };

    payments.push(newPayment);
    return newPayment;
}

export function deletePayment(paymentId: number) {
    payments = payments.filter((payment) => payment.id !== paymentId);
}
