import {PaymentType} from "@/entities/payment";
import universalFetch from "@/shared/lib/universalFetch";
import {DepositType} from "@/entities/transaction";

export async function getPayments(): Promise<PaymentType[]> {
    const payments = await universalFetch<PaymentType[]>("/payments", {
        method: "GET",
    });

    return payments.map(p => ({...p, date: new Date(p.date)}));
}

export async function addPayment(newPayment: Omit<PaymentType, "id" | "payed">): Promise<PaymentType> {
    const payment = await universalFetch<PaymentType>("/payments", {
        method: "POST",
        body: newPayment,
    });

    payment.date = new Date(payment.date);
    return payment;
}

export async function deletePayment(paymentId: number): Promise<void> {
    await universalFetch(`/payments/${paymentId}`, {
        method: "DELETE",
    });
}

export async function executePayment(data: { paymentId?: number } & DepositType): Promise<void> {
    const body = Object.assign({}, data);
    delete body.paymentId;

    await universalFetch(`/payments/${data.paymentId}`, {
        method: "PUT",
        body
    });
}